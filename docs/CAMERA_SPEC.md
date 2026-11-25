# Box camera spec: homepage scroll-through

Instructions for reworking the camera and box choreography in the homepage scroll-through. **Only the camera and motion change. Leave the box model, the copy and the page layout alone.**

## Where the code lives

| What | File |
|---|---|
| Camera, box pose, lid, goods (all per-frame motion) | `src/components/scroll/BoxModel.tsx` |
| Scroll timeline and the text beats around the box | `src/components/scroll/ScrollStory.tsx` |
| The 3D model (do not change for this task) | `intro/build_box.py` → `public/models/marlowby-box.glb` |

Everything is driven by one number, scroll progress `p` (0 at the top of the pinned section, 1 at the end). `BoxModel.tsx` reads it every frame in `useFrame`. Shared timings live in the `BEATS` constant at the top of that file.

Coordinates are three.js (Y up). The box sits at the origin, front face (with the shipping label) toward **+Z**, lid hinged at the back (−Z) edge.

## What it does now

- `CameraRig` sets a **fixed** camera at `[0, 0.5, 1.5]` looking at `[0, 0.04, 0]` (pulled back further on tall phone screens).
- All movement comes from **rotating the box** (`root.rotation.y` swings from three-quarter left to right, then settles front-on at the end).
- Lid opens over `BEATS.lidOpen` (p 0.44–0.56), goods rise over `BEATS.goods` (p 0.50–0.68), lid closes over `BEATS.close` (p 0.72–0.82).

## What we want instead

The box should stay still and **the camera moves**:

1. **Arrive, facing forward** (p ≈ 0.12–0.40, the "One city. One box." beat)
   - Box fades in front-on: `root.rotation.y = 0`, label facing the viewer.
   - Camera at eye level with the box, straight on (roughly `[0, 0.12, 1.5]`, looking at the box center).
   - A very slow idle drift is fine; no swinging.

2. **Rise and look in** (p ≈ 0.42–0.56, as the lid opens)
   - Camera moves **up and toward the front** and tilts down, so it ends looking **into the open box at an angle**, about 45–55° above the box, offset along the **Z axis** (still on the front side, not straight overhead).
   - Rough target: position `[0, 0.85, 0.95]`, looking at `[0, 0.06, 0]`. Tune by eye.
   - Lid opens during this move (keep `BEATS.lidOpen`).

3. **Contents come out** (p ≈ 0.50–0.70, the "What a city fits in a box" beat)
   - With the camera looking down into the box, the goods rise out one by one in list order (keep the existing stagger in `BEATS.goods`). They can rise higher than now (`RISE` array) since the camera sees into the box.

4. **Settle for the label** (p ≈ 0.72–0.90, "Hello from New York.")
   - Goods sink back, lid closes, camera returns to the front-on eye-level shot so the label reads.

## How to build it

- Replace the fixed `CameraRig` with a camera animated in `useFrame`: interpolate position and look-at target from `p` (use the existing `ramp()` helper for eased segments), then call `camera.lookAt(target)` each frame.
- Keep the **tall-screen adjustment**: multiply the camera distance on phones the way `CameraRig` does now (`aspect < 1`), or the box overflows on mobile.
- Remove the box `rotation.y` swing; keep `scale` (fade-in) and the small `dip`/float only if they still look right.
- If you change any `p` ranges, update the matching text beats in `ScrollStory.tsx` (`useBeat(p, …)` calls and `MakerRow` timing) so copy and motion stay in sync.
- Don't touch the reduced-motion fallback in `src/routes/Home.tsx`; people with reduced motion never see this scene.

## Check before pushing

- `npm run dev`, scroll the homepage at desktop width **and** at phone width (375×812 in dev tools). The box must never be cut off by the screen edge or hidden under the text.
- `npm run build` passes with no type errors.

## Avoiding merge conflicts

This task should only touch `src/components/scroll/BoxModel.tsx` (and `ScrollStory.tsx` only if timings move). Before starting and again before pushing:

```
git pull origin main
```

Commit with a clear message, then `git push origin main`. If someone else changed the same file, Git will ask you to merge; keep both sides' changes and test again before pushing.
