---
name: Marlowby
description: A monthly box from a different U.S. city, staged as one object on a deep teal stage.
colors:
  ground: "#0e4a47"
  ground-deep: "#0a3634"
  ground-raised: "#135955"
  ink: "#142221"
  cream: "#f3e9d7"
  cream-muted: "#d8ccb7"
  coral: "#e8664e"
  coral-hover: "#f07a63"
  coral-ink: "#b8432e"
  city-accent: "#e8664e"
  kraft: "#b98a55"
  kraft-side: "#9c7040"
  kraft-dark: "#7d5730"
  cream-hairline-faint: "rgb(243 233 215 / 0.08)"
  cream-wash: "rgb(243 233 215 / 0.12)"
  cream-hairline: "rgb(243 233 215 / 0.14)"
  cream-hairline-foot: "rgb(243 233 215 / 0.16)"
  cream-wash-hover: "rgb(243 233 215 / 0.22)"
  cream-ring: "rgb(243 233 215 / 0.45)"
  ink-fold: "rgb(20 34 33 / 0.18)"
  ink-shadow: "rgb(20 34 33 / 0.28)"
  ink-ring: "rgb(20 34 33 / 0.4)"
  ground-shadow: "rgb(0 0 0 / 0.55)"
  hero-veil: "rgb(0 0 0 / 0.6)"
  ground-deep-nav: "rgb(10 54 52 / 0.96)"
typography:
  display:
    fontFamily: "Charger Pro Extended, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 1.8rem + 4.6vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  voice-display:
    fontFamily: "Literata Variable, Literata, Georgia, serif"
    fontSize: "clamp(2.8rem, 1.8rem + 4.6vw, 6rem)"
    fontWeight: 380
    lineHeight: 1.04
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 72"
  headline:
    fontFamily: "Charger Pro Extended, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 2.8vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  statement:
    fontFamily: "Trueno, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 2.8vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Charger Pro Extended, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.35rem + 1.2vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Trueno, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Trueno, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.13rem)"
    fontWeight: 400
    lineHeight: 1.55
  voice:
    fontFamily: "Literata Variable, Literata, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Trueno, system-ui, sans-serif"
    fontSize: "clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)"
    fontWeight: 600
    letterSpacing: "0.04em"
  button:
    fontFamily: "Trueno, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "0.01em"
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
  display-word-space: "0.24em"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7em 1.35em"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.coral-hover}"
    textColor: "{colors.ink}"
  button-primary-on-cream:
    backgroundColor: "{colors.coral-ink}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7em 1.35em"
    height: "44px"
  button-primary-on-cream-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
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
    backgroundColor: "{colors.cream-wash}"
    textColor: "{colors.cream}"
    rounded: "{rounded.round}"
    size: "44px"
  nav-solid:
    backgroundColor: "{colors.ground-deep-nav}"
    textColor: "{colors.cream}"
    padding: "1rem clamp(1rem, 0.4rem + 3vw, 3rem)"
  box-label:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "7% 8%"
  steps-section:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    padding: "clamp(5rem, 3rem + 9vw, 11rem) clamp(1rem, 0.4rem + 3vw, 3rem)"
  closing-section:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    padding: "clamp(5rem, 3rem + 9vw, 11rem) clamp(1rem, 0.4rem + 3vw, 3rem)"
---

# Design System: Marlowby

## Overview

**Creative North Star: "The City in a Box, Under Stage Light"**

Marlowby is staged like a film with one star: the month's kraft box. The ground is a deep teal, dark enough to read as a stage at night, and everything else is lit against it. Night footage of the city opens the page, a serif line arrives word by word over it, and from there the box itself carries the story: it turns, its lid swings open as you scroll, the city's goods rise through tissue in the city's accent color, and at the close a second box sits shut, labeled for the next city. The structure is the category-standard subscription page (hero, what it is, what's inside, three steps, subscribe), executed with cinematic scroll craft rather than stock photography and icon cards.

The density is low and the scale is high. Sections are full-bleed bands, separated by a change of ground (teal, coral, cream) rather than by cards, borders or dividers. Type does the heavy lifting: a very heavy extended display face for titles and the wordmark, a clean geometric sans for reading and controls, a literary serif for anything said in a human voice, and a monospace that appears only when the content is genuinely data, such as coordinates, edition numbers and neighborhood-plus-founding-year lines. The palette is the team's own: deep teal, coral and cream, chosen for accessible contrast and a kraft-paper box feel.

Motion is continuous with scroll and eased on one long out-curve. Every animated piece has a reduced-motion state that lands on the finished frame: the box rests open at a fixed angle, the goods sit fully risen, the list rows are fully lit, the statement is fully lit, the video is paused.

**Key Characteristics:**
- One deep teal stage, with coral and cream as the only alternate section grounds.
- Coral as the action and city color; it steps down to coral-ink wherever it must carry text or a button on cream.
- Charger Pro Extended, set very heavy, for titles and the wordmark, always with widened word spacing.
- Trueno for body, labels, buttons, maker names and the statement.
- Literata (optical size 72 at display) for voice lines, often italic.
- DM Mono only for real data.
- A CSS-3D kraft box built from flat faces is the single recurring object and the page's signature.
- Flat surfaces, square corners, pill buttons; the only cast shadow is the box's ground shadow.

## Colors

A cool-dark, warm-light palette: deep teal grounds, coral for action and the city, cream for type and the light ground, and three kraft tones reserved for the box.

### Primary
- **Marlowby Coral** (`coral`): the fill of every primary action on teal (Subscribe in the nav), the hero's "That's Marlowby." sign-off, live state (the focus ring, text selection, the caret), and the ground of the "How it works" band. Hover lightens to **Lit Coral** (`coral-hover`). As text on teal it is used only at display size, where its 3.1:1 clears the large-text threshold.
- **Coral Ink** (`coral-ink`): coral's text-and-button form on cream, at 4.5:1. It colors the serif half of the closing title, the city name on the box label, and fills the closing Subscribe button (with cream text).
- **City Accent** (`city-accent`): a per-city slot, coral for New York. It colors the tissue inside the box and the 1px progress bar that draws across each box-list row as its item rises. A new city changes this one token.

### Neutral
- **Deep Teal** (`ground`): the page ground, the hero and statement, the box scene, the footer; also one of the goods inside the box.
- **Night Teal** (`ground-deep`): at 96% (`ground-deep-nav`), the nav once it turns solid. The hero veil over the city footage is black, not teal, running from full black at the bottom left to 60% (`hero-veil`) at the top right.
- **Raised Teal** (`ground-raised`): one step above the stage; used for a dark good inside the box, outlined in cream, so it separates from the stage behind it.
- **Shadow Ink** (`ink`): text on every coral and cream surface, the 2px rules on the coral field and the box label, and the hover fill of the closing Subscribe button.
- **Shell Cream** (`cream`): primary type on teal; the ground of the closing section; the box's shipping label; the step nodes on the coral field.
- **Muted Cream** (`cream-muted`): secondary text on teal (6.3:1): ledes, place lines, the italic item descriptions, fine print.

### Translucent tokens
- **Cream hairlines**: 14% (`cream-hairline`) for the box-list row tops, 16% (`cream-hairline-foot`) for the hero's foot rule, 8% (`cream-hairline-faint`) for the solid nav's bottom edge. These are the only rule lines on teal.
- **Cream ring** (`cream-ring`, 45%): the ghost button's inset outline on teal.
- **Cream wash** (`cream-wash`, 12%; `cream-wash-hover`, 22%): the video toggle's fill and hover.
- **Ink ring** (`ink-ring`, 40%): the ghost button's outline on cream.
- **Ink shadow** (`ink-shadow`, 28%): the box's ground shadow on cream.
- **Ink fold** (`ink-fold`, 18%): the center crease on the folded map inside the box.
- **Ground shadow** (`ground-shadow`, black at 55%): the box's ground shadow on teal.

### Tertiary (the box's materials)
- **Kraft** (`kraft`): front face and lid outer face of the box.
- **Kraft Side** (`kraft-side`): side and back faces, which read as the box turning away from the light; also the scrollbar thumb.
- **Kraft Dark** (`kraft-dark`): interior faces, floor and lid inner face.

### Named Rules
**The Coral Contrast Rule.** Coral fills carry ink text (5.0:1), never cream. On cream, coral steps down to coral-ink for text and buttons (4.5:1), and a coral-ink button carries cream text. Coral as text on teal is display size only.

**The Signal Coral Rule.** Coral means "act here", "this is the city", or "this is live". Its one use as a ground is the "How it works" band, and nothing on that band is coral: its type and rules are ink, its nodes cream.

**The Three Grounds Rule.** Sections are teal, coral or cream. A change of ground is the section divider; no cards, panels or boxed containers sit on top of a ground.

**The Ink-On-Light Focus Rule.** The focus ring is 2px coral at 3px offset on teal; on the cream ground it switches to ink.

## Typography

**Display Font:** Charger Pro Extended (with Arial Black, system-ui, sans-serif), static OTFs under the SIL OFL
**Body Font:** Trueno (with system-ui, sans-serif), static OTFs at 400, 600, 700 and 800 under the SIL OFL
**Voice Font:** Literata Variable (with Literata, Georgia, serif), loaded with its `opsz` axis, roman and italic
**Data Font:** DM Mono 400 (with ui-monospace, monospace)

**Character:** A blunt, very wide display face that shouts the brand and the city, a friendly geometric sans that carries reading and controls, and a bookish serif that speaks in the first person. The mono is a quiet ledger beneath all three.

The scale is a fluid six-step ramp (`--step--1` through `--step-4`) clamped between phone and wide desktop, roughly 1.25 at the small end opening to about 1.6 at display.

### Hierarchy
- **Display** (Charger 900, step 4, 0.95 to 0.98, -0.035em, uppercase): section titles that act as statements, "How it works" and the slogan close "Explore Your City, / One Box at a Time.", and the placeholder page titles; the nav wordmark at 1.3rem; the box's lid and label mark; the footer wordmark scaled to span the content width (`calc((100vw - 2 * gutter) / 4.75)`, line-height 0.8, -0.04em).
- **Voice Display** (Literata 380, opsz 72, step 4, 1.04, -0.025em): the hero line only. Its sign-off is italic 460 in coral.
- **Headline** (Charger 800, step 3, 1.02, -0.03em, max 12ch, sentence case): the box scene's title.
- **Statement** (Trueno 700, step 3, 1.12, -0.025em, max 20ch): the one-paragraph "what Marlowby is" passage, lit word by word on scroll from 16% to full.
- **Title** (Charger 700, step 2, 1.1, -0.02em): step names.
- **Title Small** (Trueno 700, step 1, 1.2, -0.015em): maker names in the box list.
- **Body** (Trueno 400, step 0, 1.55): running text; measure 32ch to 40ch in practice, 62ch token ceiling.
- **Voice** (Literata italic, step 0 to step 3): item descriptions under each maker, the footer's line, the closing title's serif half (400, coral-ink), the lid's greeting, step numerals (step 3, ink at 60%).
- **Label** (Trueno 600, step -1, 0.04em, uppercase): nav links, footer links, the hero scroll cue.
- **Button** (Trueno 700, 0.01em): pill button text; size follows context (label size uppercase in the nav, step 1 at the close).
- **Data** (DM Mono 400, step -1, 0.02em): coordinates, "No. 001", neighborhood-and-year lines, copyright. On the box, mono goes uppercase at 0.08em to 0.12em tracking.

### Named Rules
**The Four Voices Rule.** Charger speaks for the brand's loudest lines (titles and the wordmark), Trueno for reading and controls, Literata for people and feeling, DM Mono only for facts that are data. If a line is not a coordinate, a number, a date or a place-and-year, it is not mono.

**The Heavy Charger Rule.** Charger runs light, so each CSS weight maps one cut heavier: 700 is the Extrabold Extended file, 800 Black Extended, 900 Ultrablack Extended. Charger is only set at 700, 800 or 900; there is no lighter file.

**The Open Word Rule.** Every Charger selector carries `word-spacing: var(--display-word-space)` (0.24em), because Charger's own space glyph is only 0.11em and multi-word titles run together without it.

## Layout

Full-bleed horizontal bands, each padded by `section` vertically and `gutter` horizontally; there is no centered max-width container, so content sits left-aligned against the gutter and the wide display type runs to its own measure (12ch, 15ch, 20ch). The hero fills the small viewport height (`100svh`) and anchors its copy to the bottom left above a hairline foot row.

The box scene is a 340vh scroll track with a sticky two-column stage (box 1.05fr, copy 1fr, gap `clamp(1rem, 4vw, 5rem)`). Scroll progress drives the box; the list rows light in sequence at progress 0.42, 0.52, 0.62 and onward. The closing reuses the two-column split with the closed box on the right.

Steps are a three-column grid (gap `clamp(1.5rem, 4vw, 4rem)`) joined by a 2px ink top rule per item.

Responsive behavior: at 860px and below the box scene stops pinning and stacks (title and lede, then box, then list), the box opens against its own scroll position, and the closing stacks title, box, actions. At 760px steps go to one column. At 640px the nav links hide (wordmark and Subscribe remain) and the hero's place line hides. All tap targets hold a 44px minimum.

## Elevation & Depth

The system is flat. Depth comes from real 3D in the box (CSS perspective 1600px, origin 50% 20%, `preserve-3d` faces) and from tonal shifts between kraft faces, not from shadows on surfaces. The box sits on a soft radial ground shadow; nothing else casts one. Light on dark is handled with alpha hairlines and the hero's diagonal black veil, which is heaviest behind the headline.

### Shadow Vocabulary
- **Box ground shadow** (`radial-gradient(closest-side, ground-shadow, transparent)`, 1.5 box-widths by 0.3, placed at 72% height): under the box on teal. On cream it lightens to `ink-shadow`.
- **Nav hairline** (`box-shadow: 0 1px 0 cream-hairline-faint`): bottom edge of the nav once it turns solid after 85% of the first viewport.
- **Ghost ring** (`box-shadow: inset 0 0 0 1px cream-ring`, full cream on hover): the outline of ghost buttons, drawn as an inset ring instead of a border.

### Named Rules
**The Ground-Shadow-Only Rule.** The only cast shadow belongs to the box, because it is the only object. Surfaces stay flat; separation comes from ground color and hairlines.

## Shapes

Rectangles are square-cornered: sections, box faces, the shipping label, rules. Rounding appears in exactly two forms: the full pill on buttons (999px) and the circle on the video toggle and the cream step nodes (50%). Lines are 1px hairlines on teal and 2px solid ink on the coral steps and the label's mark underline. The box's tissue is the one irregular shape, a slightly skewed quadrilateral clip (`polygon(3% 4%, 97% 2%, 99% 96%, 2% 98%)`) so it reads as paper. Icons are small inline SVGs on a 16-unit grid with 1.6 strokes and square caps.

## Components

### Buttons
Pill-shaped, wide-set and confident.
- **Shape:** full pill (999px), minimum height 44px, padding 0.7em by 1.35em.
- **Primary (on teal):** coral fill, ink text, Trueno bold. In the nav it runs at label size and uppercase.
- **Primary (on cream):** coral-ink fill with cream text at step 1 and a trailing arrow; hover fills with ink.
- **Hover / Focus / Active:** fill shifts over 0.25s on the ease-out curve (coral to Lit Coral on teal); the trailing arrow nudges 3px right; press scales to 0.97; focus is the global 2px coral outline at 3px offset, ink on cream.
- **Ghost:** transparent with a 1px inset cream ring at 45% that firms to full cream on hover. On the cream closing ground the ring and text invert to ink (ring at 40%).

### Navigation
Fixed, full width, transparent over the hero and turning solid (Night Teal at 96% plus an 8% cream hairline) once the visitor has scrolled past 85% of the first viewport; always solid off the homepage. Wordmark left in Charger 900 caps at 1.3rem; uppercase label links with an underline that draws in from the left on hover (1px, 0.35s); coral Subscribe pill on the right. Below 640px only the wordmark and Subscribe remain.

### Lists and rows
The box list is an ordered list of rows split by cream hairlines (14%). Each row: maker name (Title Small), place-and-year in mono, right-aligned, and an italic Literata description in muted cream. As the matching good rises, the row brightens from 22% to full opacity, slides 18px into place, and a 1px city-accent bar draws across its top rule.

### Steps
Three columns on the coral field, ink type throughout, each topped by a 2px ink rule with a 12px cream node riding it at the left. A large italic serif numeral in ink at 60% opacity, then the step name in Charger 700 and a short body at 32ch. Items rise 28px and fade in on view, staggered by 0.12s.

### Hero media
Full-bleed muted looping video with a poster, scaled from 1 to 1.12 as the hero scrolls out while the copy lifts 18%. The veil fades from 10% to 80% opacity after the intro delay (2.4s, skipped on first wheel, touch or key). Words resolve from 0.35em below with a 10px blur, 0.07s apart. A 44px circular pause/play toggle (cream wash at 12%, 22% on hover) and an uppercase scroll cue with a gently bobbing arrow sit in the foot row.

### The Kraft Box (signature)
A box built from flat CSS faces: front, inner front, back, two sides, floor, tissue and a hinged lid, sized from one variable (`--w`, clamped by viewport; height 0.56w, depth 0.74w). The front carries a cream shipping label: the MARLOWBY mark in Charger 900 caps over a 2px ink rule, the edition number in mono, the city in coral-ink italic serif, and coordinates in mono. The right side carries an "Open here" stamp in mono at 55%. The lid's inner face greets in cream serif on kraft dark ("Hello from New York."). The tissue takes the city accent.

On the homepage the box turns from -38deg to -16deg and its lid swings from -90deg (closed) to 24deg (open) across scroll progress 0.16 to 0.42, smoothed by a spring (stiffness 120, damping 30, mass 0.4). Then the goods, flat colored panels labeled in mono (cream, deep teal, raised teal with a cream inset rule, coral, and a cream folded map with an ink crease), rise one by one through the tissue in step with the list. At the close the same component returns shut, turned the other way (rotateY 24deg), labeled "No. 002", "Next city", "Ships next month", and fades up 40px on view.

#### The scroll-through (homepage, motion-on)
With motion allowed, the homepage opens as one pinned stage (`src/components/scroll/ScrollStory.tsx`, 620vh, sticky 100svh) instead of the CSS box section. The box there is a real 3D model: built headless in Blender by `intro/build_box.py` (source `intro/marlowby-box.blend`), exported to `public/models/marlowby-box.glb` (about 180 KB) and rendered live with three.js in `BoxModel.tsx`, lazy-loaded. Kraft walls have thickness, the lid pivots on the back hinge, the tissue is crumpled coral, and the goods are true solids (babka tin, cookie bag, za'atar jar, coffee bag, folded map). The front label and lid print are blank UV planes painted at runtime from a canvas in the site's own fonts, so one model serves every city. Lighting: a cream-to-deep-teal hemisphere, a warm key and a coral rim, with a soft contact shadow.

Scroll progress p (spring 140/32/0.35) drives everything, and each beat cross-dissolves with a 12px blur and 24px drift:

| p | Stage |
|---|---|
| 0 to 0.13 | NY footage and the serif hero line; the line blurs out |
| 0.10 to 0.24 | footage dissolves into the teal stage; the box fades and scales in (0.62 to 1) |
| 0.22 to 0.43 | "One city. One box." left, the statement right, box swinging three-quarter |
| 0.43 to 0.75 | "What a city fits in a box" left, makers right; lid opens 0.44 to 0.56, goods rise 0.50 to 0.68 in list order |
| 0.72 to 0.90 | lid closes, box settles front-on to show the label |
| 0.76 to 1 | "Hello from New York." with "No. 001 · New York, NY" in the city accent |

A 4px cream progress rail runs down the right edge. The camera pulls back on tall screens so the box keeps the same share of the frame. With reduced motion the homepage falls back to the plain Hero, Statement and CSS box sections described above.

**The One Object Rule.** The kraft box is the system's only 3D object and its only illustration. New surfaces that need to show the product reuse this component (the CSS box or the Blender model) with new label data; they don't introduce photographs of boxes, a second 3D object or illustrated substitutes.

### Footer
Teal ground, an italic serif line and uppercase label links on one row, then the wordmark at full content width in Charger 900 caps, cropped tight at 0.8 line-height, and mono fine print.

## Do's and Don'ts

### Do:
- **Do** set pages on Deep Teal and change ground (teal, coral, cream) to mark a new section.
- **Do** put ink text on every coral fill, and switch to coral-ink with cream text for buttons and coral text on cream.
- **Do** keep coral for actions, the city and live state (focus, selection, caret); route anything that should change per city through `city-accent`.
- **Do** set Charger only at 700, 800 or 900, and give every Charger line `word-spacing: var(--display-word-space)`.
- **Do** set body, labels, buttons and the statement in Trueno.
- **Do** write voice lines (greetings, descriptions, the sign-off) in Literata, italic when it is a person or a city speaking.
- **Do** reserve DM Mono for coordinates, edition numbers, dates and place-and-year lines.
- **Do** ease every transition on `cubic-bezier(0.16, 1, 0.3, 1)`; 0.25s for state changes, 0.8s to 1s for reveals.
- **Do** give every scroll or intro animation a reduced-motion end state that shows the finished frame.
- **Do** hold all interactive targets to 44px and keep the 2px focus outline at 3px offset (coral on teal, ink on cream).

### Don't:
- **Don't** put cream text on coral, coral text on cream at body size, or coral text on teal below display size.
- **Don't** place a coral element on the coral field.
- **Don't** add cards, panels, drop shadows or rounded containers on the grounds; separation is ground color and hairlines.
- **Don't** round rectangles; rounding is only the pill button and the circle.
- **Don't** set prose, headings or labels in DM Mono.
- **Don't** replace the kraft box with product photography or introduce a second 3D object.
- **Don't** set Charger without the display word spacing, or reach for a variable-width axis; width comes from the Extended cut.
