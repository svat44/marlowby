---
name: Marlowby
description: A monthly box from a different U.S. city, staged as one object on a dark stage.
colors:
  ink: "#14100c"
  ink-raised: "#1f1913"
  cream: "#ffedd7"
  cream-muted: "#cdbba6"
  olive: "#445231"
  orange: "#dc5000"
  orange-hover: "#f05a05"
  kraft: "#b98a55"
  kraft-side: "#9c7040"
  kraft-dark: "#7d5730"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 1.8rem + 4.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 125"
  voice-display:
    fontFamily: "Literata Variable, Literata, Georgia, serif"
    fontSize: "clamp(2.8rem, 1.8rem + 4.6vw, 6rem)"
    fontWeight: 380
    lineHeight: 1.04
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 72"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 2.8vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 115"
  statement:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 2.8vw, 3.75rem)"
    fontWeight: 620
    lineHeight: 1.12
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 108"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.35rem + 1.2vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title-sm:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 110"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.13rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  voice:
    fontFamily: "Literata Variable, Literata, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)"
    fontWeight: 550
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 112"
  button:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontWeight: 650
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 112"
  data:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)"
    fontWeight: 400
    letterSpacing: "0.02em"
rounded:
  none: "0"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(1rem, 0.4rem + 3vw, 3rem)"
  section: "clamp(5rem, 3rem + 9vw, 11rem)"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7em 1.35em"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7em 1.35em"
    height: "44px"
  button-ghost-on-cream:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  video-toggle:
    backgroundColor: "rgb(255 237 215 / 0.12)"
    textColor: "{colors.cream}"
    rounded: "{rounded.round}"
    size: "44px"
  nav-solid:
    backgroundColor: "rgb(20 16 12 / 0.94)"
    textColor: "{colors.cream}"
    padding: "1rem clamp(1rem, 0.4rem + 3vw, 3rem)"
  box-label:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "7% 8%"
  steps-section:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.cream}"
    padding: "clamp(5rem, 3rem + 9vw, 11rem) clamp(1rem, 0.4rem + 3vw, 3rem)"
  closing-section:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    padding: "clamp(5rem, 3rem + 9vw, 11rem) clamp(1rem, 0.4rem + 3vw, 3rem)"
---

# Design System: Marlowby

## Overview

**Creative North Star: "The City in a Box, Under Stage Light"**

Marlowby is staged like a film with one star: the month's kraft box. The ground is a warm brown-black, almost the color of a darkened theater, and everything else is lit against it. Night footage of the city opens the page, a serif line arrives word by word over it, and from there the box itself carries the story: it turns, its lid swings open as you scroll, the city's goods rise through orange tissue, and at the close a second box sits shut, labeled for the next city. The structure is the category-standard subscription page (hero, what it is, what's inside, three steps, subscribe), executed with cinematic scroll craft rather than stock photography and icon cards.

The density is low and the scale is high. Sections are full-bleed bands, separated by a change of ground (ink, olive, cream) rather than by cards, borders or dividers. Type does the heavy lifting: an expanded grotesque that widens as it grows louder, a literary serif for anything said in a human voice, and a monospace that appears only when the content is genuinely data, such as coordinates, edition numbers and neighborhood-plus-founding-year lines. Color is few and warm, with burnt orange held back as the signal.

Motion is continuous with scroll and eased on one long out-curve. Every animated piece has a reduced-motion state that lands on the finished frame: the box rests open at a fixed angle, the goods sit fully risen, the list rows are fully lit, the video is paused.

**Key Characteristics:**
- One dark, warm stage (ink) with olive and cream as the only alternate section grounds.
- Burnt orange as a rare signal: actions, the city's name, and live state.
- Archivo on its width axis, from 100 at body size to 125 for the wordmark and capitalised display.
- Literata (optical size 72 at display) for voice lines, often italic.
- DM Mono only for real data.
- A CSS-3D kraft box built from flat faces is the single recurring object and the page's signature.
- Flat surfaces, square corners, pill buttons; the only cast shadow is the box's ground shadow.

## Colors

A warm, low-key palette after oryzo.ai's scheme: brown-black, cream, olive and burnt orange, with three kraft tones reserved for the box.

### Primary
- **Burnt Signal Orange** (`orange`): the fill of every primary action (Subscribe in the nav, Subscribe at the close), the city's name wherever it is spoken (the hero's "That's Marlowby." sign-off, "every month." in the closing title, the city line on the box label), and live state: the focus ring, text selection, the caret, and the 1px progress bar that draws across each box-list row as its item rises. Hover deepens to **Lit Orange** (`orange-hover`). Inside the box, orange also appears as the tissue paper and one of the goods; there it is packing material, part of the object, not a signal. The orange nodes on the steps' rules are the one place the build uses it as pure decoration; that is recorded here as a divergence, not a precedent.

### Neutral
- **Stage Ink** (`ink`): the page ground, nav ground when solid (at 94% opacity), hero veil, footer, and the text color on every orange or cream fill.
- **Raised Ink** (`ink-raised`): one step above the stage; used for a dark good inside the box so it separates from the stage behind it.
- **Lamplight Cream** (`cream`): primary type on ink and olive; the ground of the closing section; the box's shipping label.
- **Muted Cream** (`cream-muted`): secondary text on ink: ledes, place lines, the italic item descriptions, fine print.
- **Hairline Cream** (cream at 14% to 16% alpha, `rgb(255 237 215 / 0.14)`): the only rule lines on dark ground (box-list row tops, the hero's foot rule); 8% for the solid nav's bottom hairline; 45% for the ghost button ring.

### Secondary
- **Field Olive** (`olive`): the calm ground for the "How it works" band. Cream type sits on it directly.

### Tertiary (the box's materials)
- **Kraft** (`kraft`): front face and lid outer face of the box.
- **Kraft Side** (`kraft-side`): side and back faces, which read as the box turning away from the light; also the scrollbar thumb.
- **Kraft Dark** (`kraft-dark`): interior faces, floor and lid inner face.

### Named Rules
**The Ink-On-Orange Rule.** Orange fills always carry ink text, never cream. Ink on orange clears 4.5:1; cream on orange does not.

**The Signal Orange Rule.** Orange means "act here", "this is the city", or "this is live". It is never a section ground and never a decorative wash. Orange text on cream is used only at display size, where it clears the large-text threshold.

**The Three Grounds Rule.** Sections are ink, olive or cream. A change of ground is the section divider; no cards, panels or boxed containers sit on top of a ground.

## Typography

**Display Font:** Archivo Variable (with Archivo, system-ui, sans-serif), loaded with its `wdth` axis
**Voice Font:** Literata Variable (with Literata, Georgia, serif), loaded with its `opsz` axis, roman and italic
**Data Font:** DM Mono 400 (with ui-monospace, monospace)

**Character:** A wide, confident grotesque that gets wider as it gets louder, set against a bookish serif that speaks in the first person of the brand. The mono is a quiet ledger beneath both.

The scale is a fluid six-step ramp (`--step--1` through `--step-4`) clamped between phone and wide desktop, roughly 1.25 at the small end opening to about 1.6 at display.

### Hierarchy
- **Display** (800, step 4, 0.95 to 0.98, -0.035em, uppercase, wdth 125): section titles that act as statements, "How it works" and "A new city every month."; the nav wordmark at 1.3rem; the box's lid and label mark; the footer wordmark scaled to span the content width (`calc((100vw - 2 * gutter) / 7.45)`, line-height 0.8, -0.04em).
- **Voice Display** (Literata 380, opsz 72, step 4, 1.04, -0.025em): the hero line only. Its sign-off is italic 460 in orange.
- **Headline** (700, step 3, 1.02, -0.03em, wdth 115, max 12ch): the box scene's title.
- **Statement** (620, step 3, 1.12, -0.025em, wdth 108, max 20ch): the one-paragraph "what Marlowby is" passage, lit word by word on scroll.
- **Title** (700, step 2, 1.1, -0.02em, wdth 112): step names.
- **Title Small** (650, step 1, 1.2, -0.015em, wdth 110): maker names in the box list.
- **Body** (400, step 0, 1.55, wdth 100): running text; measure 32ch to 40ch in practice, 62ch token ceiling.
- **Voice** (Literata italic, step 0 to step 1): item descriptions under each maker, the footer's line, the closing title's serif half, step numerals (step 3, 55% opacity).
- **Label** (550 to 600, step -1, 0.04em, uppercase, wdth 112): nav links, footer links, the hero scroll cue.
- **Data** (DM Mono 400, step -1, 0.02em): coordinates, "No. 001", neighborhood-and-year lines, copyright. On the box, mono goes uppercase at 0.08em to 0.12em tracking.

### Named Rules
**The Three Voices Rule.** Archivo speaks for the brand and the structure, Literata speaks for people and feeling, DM Mono speaks only for facts that are data. If a line is not a coordinate, a number, a date or a place-and-year, it is not mono.

**The Width-Is-Volume Rule.** Emphasis is carried on the `wdth` axis as much as on weight: 100 for body, 108 to 115 for headings, 112 for labels and buttons, 125 for the wordmark and capitalised display. Don't fake width with letter-spacing.

## Layout

Full-bleed horizontal bands, each padded by `section` vertically and `gutter` horizontally; there is no centered max-width container, so content sits left-aligned against the gutter and the wide display type runs to its own measure (12ch, 15ch, 20ch). The hero fills the small viewport height (`100svh`) and anchors its copy to the bottom left above a hairline foot row.

The box scene is a 340vh scroll track with a sticky two-column stage (box 1.05fr, copy 1fr, gap `clamp(1rem, 4vw, 5rem)`). Scroll progress drives the box; the list rows light in sequence at progress 0.42, 0.52, 0.62 and onward. The closing reuses the two-column split with the closed box on the right.

Steps are a three-column grid (gap `clamp(1.5rem, 4vw, 4rem)`) joined by a 2px cream top rule per item.

Responsive behavior: at 860px and below the box scene stops pinning and stacks (title and lede, then box, then list), the box opens against its own scroll position, and the closing stacks title, box, actions. At 760px steps go to one column. At 640px the nav links hide (wordmark and Subscribe remain) and the hero's place line hides. All tap targets hold a 44px minimum.

## Elevation & Depth

The system is flat. Depth comes from real 3D in the box (CSS perspective 1600px, origin 50% 20%, `preserve-3d` faces) and from tonal shifts between kraft faces, not from shadows on surfaces. The box sits on a soft radial ground shadow; nothing else casts one. Light on dark is handled with alpha hairlines and the hero's diagonal ink veil (`linear-gradient(to top right, ink 35%, ink at 62% 100%)`), which is heaviest behind the headline.

### Shadow Vocabulary
- **Box ground shadow** (`radial-gradient(closest-side, rgb(0 0 0 / 0.55), transparent)`, 1.5 box-widths by 0.3, placed at 72% height): under the box on the dark stage. On cream it lightens to `rgb(20 16 12 / 0.28)`.
- **Nav hairline** (`box-shadow: 0 1px 0 rgb(255 237 215 / 0.08)`): bottom edge of the nav once it turns solid after 85% of the first viewport.
- **Ghost ring** (`box-shadow: inset 0 0 0 1px rgb(255 237 215 / 0.45)`, full cream on hover): the outline of ghost buttons, drawn as an inset ring instead of a border.

### Named Rules
**The Ground-Shadow-Only Rule.** The only cast shadow belongs to the box, because it is the only object. Surfaces stay flat; separation comes from ground color and hairlines.

## Shapes

Rectangles are square-cornered: sections, box faces, the shipping label, rules. Rounding appears in exactly two forms: the full pill on buttons (999px) and the circle on the video toggle and the orange step nodes (50%). Lines are 1px hairlines on dark grounds and 2px solid on the olive steps and the label's mark underline. The box's tissue is the one irregular shape, a slightly skewed quadrilateral clip (`polygon(3% 4%, 97% 2%, 99% 96%, 2% 98%)`) so it reads as paper. Icons are small inline SVGs on a 16-unit grid with 1.6 strokes and square caps.

## Components

### Buttons
Pill-shaped, wide-set and confident.
- **Shape:** full pill (999px), minimum height 44px, padding 0.7em by 1.35em.
- **Primary:** orange fill, ink text, Archivo 650 at wdth 112. In the nav it runs at label size and uppercase; at the close it steps up to step 1 with a trailing arrow.
- **Hover / Focus / Active:** fill shifts to Lit Orange over 0.25s on the ease-out curve; the trailing arrow nudges 3px right; press scales to 0.97; focus is the global 2px orange outline at 3px offset.
- **Ghost:** transparent with a 1px inset cream ring at 45% that firms to full cream on hover. On the cream closing ground the ring and text invert to ink (ring at 40%).

### Navigation
Fixed, full width, transparent over the hero and turning solid (ink at 94% plus a cream hairline) once the visitor has scrolled past 85% of the first viewport; always solid off the homepage. Wordmark left in display caps at 1.3rem; uppercase label links with an underline that draws in from the left on hover (1px, 0.35s); orange Subscribe pill on the right. Below 640px only the wordmark and Subscribe remain.

### Lists and rows
The box list is an ordered list of rows split by cream hairlines (14%). Each row: maker name (Title Small), place-and-year in mono, right-aligned, and an italic Literata description in muted cream. As the matching good rises, the row brightens from 22% to full opacity, slides 18px into place, and an orange 1px bar draws across its top rule.

### Steps
Three columns on olive, each topped by a 2px cream rule with a 12px orange node riding it at the left. A large italic serif numeral at 55% opacity, then the step name and a short body at 32ch. Items rise 28px and fade in on view, staggered by 0.12s.

### Hero media
Full-bleed muted looping video with a poster, scaled from 1 to 1.12 as the hero scrolls out while the copy lifts 18%. The veil fades from 10% to 80% opacity after the intro delay (2.4s, skipped on first wheel, touch or key). Words resolve from 0.35em below with a 10px blur, 0.07s apart. A 44px circular pause/play toggle (cream at 12%, 22% on hover) and an uppercase scroll cue with a gently bobbing arrow sit in the foot row.

### The Kraft Box (signature)
A box built from flat CSS faces: front, inner front, back, two sides, floor, tissue and a hinged lid, sized from one variable (`--w`, clamped by viewport; height 0.56w, depth 0.74w). The front carries a cream shipping label: the MARLOWBY mark in display caps over a 2px ink rule, the edition number in mono, the city in orange italic serif, and coordinates in mono. The right side carries an "Open here" stamp in mono at 55%. The lid's inner face greets in serif ("Hello from New York.").

On the homepage the box turns from -38deg to -16deg and its lid swings from -90deg (closed) to 24deg (open) across scroll progress 0.16 to 0.42, smoothed by a spring (stiffness 120, damping 30, mass 0.4). Then the goods, flat colored panels labeled in mono (cream, olive, raised ink with a cream inset rule, orange, and a cream folded map), rise one by one through orange tissue in step with the list. At the close the same component returns shut, turned the other way (rotateY 24deg), labeled "No. 002", "Next city", "Ships next month", and fades up 40px on view.

**The One Object Rule.** The kraft box is the system's only 3D object and its only illustration. New surfaces that need to show the product reuse this component with new label data; they don't introduce photographs of boxes, a second 3D object or illustrated substitutes.

### Footer
Ink ground, an italic serif line and uppercase label links on one row, then the wordmark at full content width in display caps, cropped tight at 0.8 line-height, and mono fine print.

## Do's and Don'ts

### Do:
- **Do** set pages on Stage Ink and change ground (ink, olive, cream) to mark a new section.
- **Do** put ink text on every orange fill, and keep orange for actions, the city's name and live state (focus, selection, progress).
- **Do** use Archivo's `wdth` axis for hierarchy: 125 for the wordmark and capitalised display, 108 to 115 for headings, 112 for labels and buttons, 100 for body.
- **Do** write voice lines (greetings, descriptions, the sign-off) in Literata, italic when it is a person or a city speaking.
- **Do** reserve DM Mono for coordinates, edition numbers, dates and place-and-year lines.
- **Do** ease every transition on `cubic-bezier(0.16, 1, 0.3, 1)`; 0.25s for state changes, 0.8s to 1s for reveals.
- **Do** give every scroll or intro animation a reduced-motion end state that shows the finished frame.
- **Do** hold all interactive targets to 44px and keep the 2px orange focus outline at 3px offset.

### Don't:
- **Don't** put cream text on orange, or use orange as a section ground or decorative fill.
- **Don't** add cards, panels, drop shadows or rounded containers on the grounds; separation is ground color and hairlines.
- **Don't** round rectangles; rounding is only the pill button and the circle.
- **Don't** set prose, headings or labels in DM Mono.
- **Don't** replace the kraft box with product photography or introduce a second 3D object.
- **Don't** fake width or emphasis with letter-spacing where the `wdth` axis can carry it.
