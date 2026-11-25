"""Builds the Marlowby box for the homepage scroll-through.

Run headless:
  blender -b --factory-startup -P intro/build_box.py

Outputs:
  intro/marlowby-box.blend           editable source
  public/models/marlowby-box.glb     web model (three.js)
  intro/preview.png                  quick render to check the model

Node names are a contract with src/components/scroll/BoxModel.tsx:
  Box, Lid (origin on the back hinge), Tissue, Label, LidPrint,
  Good_Babka, Good_Cookies, Good_Zaatar, Good_Coffee, Good_Map (origins at their base).
Label and LidPrint carry 0-1 UVs; the site paints city text onto them at runtime.
"""
import math
import os

import bmesh
import bpy
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, D, H = 0.36, 0.26, 0.18  # width (x), depth (y), height (z), metres
T = 0.006  # cardboard thickness


def hex_rgba(h, a=1.0):
    h = h.lstrip('#')
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def material(name, hex_color, rough=0.8, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = hex_rgba(hex_color)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    return m


def finish(obj, mat, bevel=0.0015, segments=2):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = 'ANGLE'
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def cube(name, size, loc):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return o


def set_origin(obj, point):
    """Move the object's origin to a world-space point without moving the mesh."""
    offset = obj.location - Vector(point)
    obj.data.transform(__import__('mathutils').Matrix.Translation(offset))
    obj.location = Vector(point)


def join(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    o.name = name
    return o


def plane_uv(name, w, h, loc, rot):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (w, h, 1)
    bpy.ops.object.transform_apply(scale=True)
    return o  # primitive plane already has 0-1 UVs


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

kraft = material('Kraft', '#B98A55', 0.88)
kraft_in = material('KraftInside', '#9C7040', 0.92)
tissue_m = material('Tissue', '#E8664E', 0.95)
label_m = material('Label', '#F3E9D7', 0.7)
cream_m = material('Cream', '#F3E9D7', 0.55)
teal_m = material('Teal', '#135955', 0.6)
coral_m = material('Coral', '#E8664E', 0.7)
ink_m = material('Ink', '#142221', 0.35)
tin_m = material('Tin', '#D8CCB7', 0.3, 0.6)

# --- Box: floor and four walls with real thickness ---
parts = [
    cube('floor', (W, D, T), (0, 0, T / 2)),
    cube('front', (W, T, H), (0, -D / 2 + T / 2, H / 2)),
    cube('back', (W, T, H), (0, D / 2 - T / 2, H / 2)),
    cube('left', (T, D - 2 * T, H), (-W / 2 + T / 2, 0, H / 2)),
    cube('right', (T, D - 2 * T, H), (W / 2 - T / 2, 0, H / 2)),
]
box = join(parts, 'Box')
finish(box, kraft)
box.data.materials.append(kraft_in)

# --- Lid: top panel plus a front tuck lip, origin on the back hinge ---
lid_top = cube('lid_top', (W + 0.004, D + 0.004, T), (0, 0, H + T / 2))
lid_lip = cube('lid_lip', (W - 0.01, T, 0.045), (0, -D / 2 - 0.002, H - 0.0225 + T))
lid = join([lid_top, lid_lip], 'Lid')
finish(lid, kraft)
set_origin(lid, (0, D / 2 + 0.002, H + T / 2))

# Print area on the lid (painted at runtime), a hair above the surface
lid_print = plane_uv('LidPrint', W * 0.7, D * 0.22, (0, -D * 0.05, H + T + 0.0006), (0, 0, 0))
finish(lid_print, label_m, bevel=0)
lid_print.parent = lid
lid_print.matrix_parent_inverse = lid.matrix_world.inverted()

# --- Label on the front face ---
label = plane_uv('Label', W * 0.44, H * 0.5, (0, -D / 2 - 0.0006, H * 0.36), (math.radians(90), 0, 0))
finish(label, label_m, bevel=0)

# --- Tissue: crumpled sheet just under the rim ---
bpy.ops.mesh.primitive_grid_add(x_subdivisions=48, y_subdivisions=36, size=1, location=(0, 0, H - 0.018))
tissue = bpy.context.active_object
tissue.name = 'Tissue'
tissue.scale = (W - 2 * T - 0.002, D - 2 * T - 0.002, 1)
bpy.ops.object.transform_apply(scale=True)
tex = bpy.data.textures.new('Crumple', 'VORONOI')
tex.noise_scale = 0.045
disp = tissue.modifiers.new('Crumple', 'DISPLACE')
disp.texture = tex
disp.strength = 0.012
bpy.ops.object.modifier_apply(modifier='Crumple')
finish(tissue, tissue_m, bevel=0)

# --- Goods, origins at their base, resting inside the box ---
def cylinder(name, r, h, loc, mat, verts=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=(loc[0], loc[1], loc[2] + h / 2))
    o = bpy.context.active_object
    o.name = name
    finish(o, mat, bevel=0.002)
    set_origin(o, loc)
    return o


def goods_box(name, size, loc, mat, bevel=0.004):
    o = cube(name, size, (loc[0], loc[1], loc[2] + size[2] / 2))
    finish(o, mat, bevel=bevel, segments=3)
    set_origin(o, loc)
    return o


base = T + 0.002
# Babka tin: cream tin with a darker lid band
babka = cylinder('Good_Babka', 0.045, 0.12, (-0.105, 0.04, base), tin_m)
band = cylinder('babka_lid', 0.047, 0.016, (-0.105, 0.04, base + 0.115), cream_m)
babka = join([babka, band], 'Good_Babka')
set_origin(babka, (-0.105, 0.04, base))

# Cookie bag: tall soft-cornered teal bag
cookies = goods_box('Good_Cookies', (0.085, 0.05, 0.16), (-0.02, 0.055, base), teal_m, bevel=0.012)

# Za'atar jar: ink-dark jar with a cream cap
jar = cylinder('jar', 0.03, 0.085, (0.055, 0.06, base), ink_m)
cap = cylinder('cap', 0.032, 0.02, (0.055, 0.06, base + 0.085), cream_m)
zaatar = join([jar, cap], 'Good_Zaatar')
set_origin(zaatar, (0.055, 0.06, base))

# Coffee bag: coral bag with a folded top
bag = goods_box('bag', (0.075, 0.05, 0.15), (0.125, 0.05, base), coral_m, bevel=0.006)
fold = goods_box('fold', (0.077, 0.052, 0.018), (0.125, 0.05, base + 0.15), ink_m, bevel=0.003)
coffee = join([bag, fold], 'Good_Coffee')
set_origin(coffee, (0.125, 0.05, base))

# Folded map: a flat cream slab standing near the front
mapg = goods_box('Good_Map', (0.13, 0.012, 0.15), (-0.04, -0.06, base), cream_m, bevel=0.002)

# Apply all modifiers so the GLB carries final geometry
for o in list(scene.objects):
    if o.type == 'MESH':
        bpy.context.view_layer.objects.active = o
        for m in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=m.name)

# --- Preview camera and light (not exported) ---
bpy.ops.object.camera_add(location=(0.62, -0.72, 0.56))
cam = bpy.context.active_object
direction = Vector((0, 0, 0.1)) - cam.location
cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
cam.data.lens = 45
scene.camera = cam
bpy.ops.object.light_add(type='AREA', location=(0.4, -0.5, 0.9))
key = bpy.context.active_object
key.data.energy = 60
key.data.size = 0.8
key.rotation_euler = (Vector((0, 0, 0)) - key.location).to_track_quat('-Z', 'Y').to_euler()
world = bpy.data.worlds.new('World')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = hex_rgba('#0E4A47')
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
scene.world = world

# Open the lid partway for the preview render only
lid.rotation_euler.x = math.radians(-105)
for g in (babka, cookies, zaatar, coffee, mapg):
    g.location.z += 0.09

scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.device = 'CPU'
scene.render.resolution_x = 800
scene.render.resolution_y = 560
scene.render.filepath = os.path.join(ROOT, 'intro', 'preview.png')
bpy.ops.render.render(write_still=True)

# Reset to the closed rest pose before saving and export
lid.rotation_euler.x = 0
for g in (babka, cookies, zaatar, coffee, mapg):
    g.location.z -= 0.09

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'intro', 'marlowby-box.blend'))

os.makedirs(os.path.join(ROOT, 'public', 'models'), exist_ok=True)
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    if o.type == 'MESH':
        o.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=os.path.join(ROOT, 'public', 'models', 'marlowby-box.glb'),
    export_format='GLB',
    use_selection=True,
    export_yup=True,
    export_apply=True,
)
print('MARLOWBY_BOX_DONE')
