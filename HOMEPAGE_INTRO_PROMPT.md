# Marlowby Homepage Intro: Blender Animation Prompt

Paste everything below the line into Claude Code, opened in this repo.

---

## Role

You are the design director and technical animator for Marlowby. Build an opening animation for the homepage in Blender, then wire it into the site. Work from the repo as it stands. Read the existing code, copy, colors and fonts first, and let them decide the look. Do not invent a brand the repo does not have.

## Skills to use

- Use the impeccable skill for every design decision. Run its context step first. Use its critique, polish and audit passes on the finished result. Run its detector over the changed files before you call the work done.
- Use the apple-design skill to judge layout, hierarchy, motion and accessibility against Apple's Human Interface Guidelines. Use it as the review lens on every storyboard frame and on the final page.
- Use the superdesign skill if you want to explore alternative layouts before committing. Pick one direction and say why.

If a skill is unavailable, say so in one line and continue with its principles.

## Goal

A short intro, 4 to 6 seconds, that opens the Marlowby homepage and hands off cleanly to the live page. It should say what Marlowby is and feel like the site that follows it. It must be skippable, and it must never block content.

## Visual rules

Style is flat and clean.

- Flat planes of solid color. Hard, straight edges. Panels are flat rectangles that slide, wipe, split and reveal. They are surfaces of the composition, not containers.
- No gradients, glows, glass, blur, drop shadows, bevels or 3D lighting. In Blender use orthographic cameras, emission or flat shading, and no scene lights that create falloff.
- No floating pills. No rounded columns. No rounded corners on panels. No cards or boxes with information inside them.
- Text sits directly on the flat color fields. It is set large, in the site's own typeface, with real hierarchy: one idea per beat.
- Palette comes from the repo. Limit it to 3 colors plus a text color. Check contrast at 4.5:1 or better for all text.
- Grid based layout. Use consistent margins and a clear baseline. Everything aligns to something.

## Motion rules

- Flat, deliberate movement: slides, wipes, scales and cuts along straight axes.
- Use ease-out for entrances and ease-in for exits. Keep durations between 300 and 700 ms per move, with one clear focal point at any time.
- No bounce, wobble, spin, particles, lens flares, morphing blobs or looping decoration.
- Motion must explain something: what Marlowby is, where to look next, or how the page is structured. If a move explains nothing, cut it.
- Honor reduced motion. When the user prefers reduced motion, show the final frame with no animation.

## Avoiding generic AI output

Before anything is built, write down what is specific to Marlowby: its name, its purpose, its audience, its real copy from the repo. Build the intro from those facts. Reject the following on sight:

- Stock phrases, filler taglines, invented statistics or testimonials.
- Purple to blue gradients, neon accents, glassmorphism, emoji, generic icon sets.
- Centered hero with a floating badge above the headline.
- Symmetrical three-card feature rows.
- Any element that exists only to look busy.

Use only copy found in the repo, or copy the user approves. If the copy does not exist, ask.

## Process

1. Read the repo. Summarize the product, audience, stack, fonts, colors and existing copy in a few lines. If the repo has no design context, run the impeccable init step and ask the user the questions it needs.
2. Write a storyboard of 4 to 6 frames as plain text: what is on screen, what moves, and the time of each beat. Check it against the visual and motion rules above. Show it to the user and get a go-ahead before building.
3. Build the scene in Blender using its Python API through tool calls:
   - Orthographic camera, 16:9, flat emission materials only.
   - Panels are plain planes or thin boxes with sharp corners.
   - Text objects use the site font, converted to curves only if needed.
   - Keyframe with explicit easing. Frame rate 60.
   - Keep the .blend file and the build script in the repo under `intro/`.
4. Render. Prefer a small WebM (VP9) and an MP4 (H.264) fallback with a poster frame. Keep the combined size under 1.5 MB. If the motion is simple enough, rebuild it as CSS or SVG animation instead of video. That is lighter, sharper and accessible, and it is the preferred outcome when it looks the same.
5. Integrate into the homepage:
   - Plays once on first visit, then skips on later visits.
   - Skip control that is keyboard reachable and visible from the first frame.
   - Page content is in the DOM underneath from the start, so screen readers and slow connections are never blocked.
   - Reduced motion shows the end state.
   - No layout shift on handoff.
6. Verify. View the rendered result at desktop, tablet and phone widths. Fix everything one look shows, then look again. Run the impeccable detector and an audit pass. Confirm contrast, focus order, and performance.

## Deliverables

- `intro/` folder with the .blend source, build script, rendered video files and poster, or the CSS and SVG version.
- Homepage integration code.
- A short note listing the storyboard, what was cut and why, and anything the user must supply, such as a logo or final copy.

## Definition of done

The intro looks like it belongs to Marlowby and to nobody else. It is flat, quiet and exact. Nothing in it is decorative. It can be skipped in one keystroke, and the site loads just as fast without it.
