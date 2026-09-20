# Beyond Premium Website Redesign

## Goal
Rebuild the attached Beyond studio site as a distinct, high-end one-page experience using its real brand content and portfolio imagery, without copying its existing composition.

## What I’ll build
- A sticky, lightweight header with active section tracking and a cinematic mobile navigation overlay.
- A dark editorial hero with restrained champagne-gold accents, an interactive canvas light/particle field, dual calls to action, and reduced-motion support.
- An oversized brand statement, asymmetrical studio story, founder profile, and animated statistics.
- Editorial service rows with responsive motion and contextual visual previews rather than standard cards.
- A visually varied portfolio with category filtering, asymmetric project sizing, subtle image motion, and an accessible project detail dialog.
- A scroll-aware process timeline, restrained industry typography band, testimonial, and single-open FAQ.
- A strong final project invitation, validated inquiry form with clear success/error states, and a substantial footer.
- A refined desktop cursor and magnetic interactions that automatically simplify on touch devices.

## Visual system
- Near-black and deep navy foundations, warm off-white type, champagne/metallic gold used only for emphasis.
- Editorial display typography paired with a highly readable sans-serif body face.
- Fine rules, subtle grain, deliberate asymmetry, minimal radii, and no generic SaaS cards or heavy glow effects.
- One cohesive motion language: quick feedback, measured reveals, and cinematic hero movement.

## Technical approach
- Keep the current React, TypeScript, TanStack Start, Vite, and Tailwind CSS v4 setup.
- Split the page into reusable layout, section, motion, navigation, portfolio, form, and footer components.
- Extract selected embedded reference images into optimized local WebP assets with fixed aspect ratios and lazy loading below the fold.
- Use small native React/CSS utilities plus canvas and `requestAnimationFrame`; avoid a heavy animation dependency.
- Add semantic structure, keyboard support, visible focus states, form validation, accessible dialogs/accordion, and route-specific social metadata.

## Validation
- Check desktop and mobile layouts in the live preview.
- Verify navigation, filter, dialog, FAQ, menu, form validation, reduced motion, and console health.
- Inspect for overflow, text collisions, image loading, and visual consistency.
