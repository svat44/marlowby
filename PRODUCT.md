# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated, then revised by the user toward a richer, interactive build: Vite + React + TypeScript, React Router for the seven pages, and Motion (motion.dev) for animation and interaction. Builds to static files, so it still deploys to any static host. Chosen because the site needs stateful interactive pieces (plan comparison, city switching, a validated sign-up form, the homepage intro) that a component model and a real animation library handle cleanly. Revisit only if BPA rules require otherwise.

## Users

Primary audience: adults roughly 22 to 45 who enjoy travel, food, gifts and supporting small businesses. They arrive curious about Marlowby and want three answers before joining: what they get, what it costs, and why they can trust it. Some are buying for themselves, some are considering it as a gift.

Secondary audience: the judges of the BPA Website Design and Development Team event, who evaluate the site as a competition submission.

## Product Purpose

Marlowby is a subscription service. Each month a subscriber receives a box of local products, small-business goods and cultural experiences from a different U.S. city.

The website is Marlowby's official site. It exists to help visitors understand the service, compare subscription options and feel excited to join. Success means a visitor can explain how Marlowby works, pick a plan and complete sign-up without confusion.

## Positioning

Each box is one specific U.S. city, sourced from that city's own small businesses, and the city changes every month. The value is a trip to a place through its local makers, not a generic assortment of goods.

## Operating Context

- Context: a student team entry for the BPA Website Design and Development Team event. Submission deadline: April 1, 2027.
- Customer journey the site follows, from awareness to action:
  1. Home: a clear tagline, a hero image, a three-step explanation and a prominent subscribe button
  2. How It Works: the path from choosing a plan to receiving a monthly city box
  3. Plans and Pricing: three tiers with the best value highlighted
  4. Featured Cities: example boxes for four to six cities
  5. Local Partners: profiles of the businesses and products in each box
  6. Sign Up: a validated form with a confirmation state
  7. About and Mission: how Marlowby supports local communities
- A homepage opening animation is planned; its brief is in `HOMEPAGE_INTRO_PROMPT.md`.

## Capabilities and Constraints

- Subscription with three tiers. Tier names, prices and contents are not yet decided.
- Sign-up is a front-end form with validation and a confirmation state. No real payment or account system is in scope.
- Featured cities: four to six real U.S. cities. Which cities is not yet decided.
- Local partners: real businesses in those cities, named by the user's choice. Describe them only with verifiable facts (what they make or sell, where they are). Never invent quotes, endorsements, partnership claims or reviews attributed to a real business.
- BPA event rules are not yet captured. Do not assume limits on libraries, asset sourcing or hosting until the team supplies them.

## Brand Commitments

- Name: Marlowby.
- Official BPA slogan: "Marlowby: Explore Your City, One Box at a Time." Use it verbatim, with this capitalization, wherever the product is introduced (page title, metadata, the homepage close, the footer).
- Personality: warm, curious, local.
- Palette committed by the team: deep teal, coral and cream, chosen for accessible contrast and a kraft-paper box feel. (Briefly swapped for oryzo.ai's colors on 2026-11-25; the user restored the team palette the same day.)
- oryzo.ai is inspiration only for motion, the 3D object treatment and craft level (cinematic scroll storytelling around one central object, very large display type, a serif for the voice lines). It is not a source of colors.
- Layout: the classic subscription-box structure, chosen on purpose and executed at oryzo.ai's level of craft.
- Homepage opens on New York footage (supplied by the user, used with the owner's permission) that fades into the line "Imagine you could have a whole city at home. That's Marlowby." set in a serif.
- Each featured city gets its own accent color so every box feels distinct.

## Evidence on Hand

- No logo, photography, tagline, pricing, testimonials, subscriber counts or press exist yet.
- Do not fabricate testimonials, subscriber numbers, ratings, press mentions or statistics. Any sample content must be clearly sample content and must not misrepresent real businesses.
- Briefs: `HOMEPAGE_INTRO_PROMPT.md` (homepage intro animation).

## Product Principles

1. **Answer the three questions first.** What you get, what it costs and why to trust it should be findable from any page within one step.
2. **The city is the product.** Each box's identity comes from its real place and real makers. Specific local detail beats generic "artisan" language.
3. **Honest about small business.** Show partners as they are. Support for local communities is shown through the specific businesses, not claimed in the abstract.
4. **One clear path to join.** Every page leads toward plans and sign-up without pressure tactics.

## Accessibility & Inclusion

The team chose the palette for accessible contrast. Target WCAG 2.2 AA: 4.5:1 for body text, full keyboard operation, visible focus, labeled form fields with clear error messages, and reduced-motion support (also required by the intro brief). This target is inferred from those stated goals; confirm it if the BPA rubric names a different standard.
