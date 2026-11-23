## Role

You are a senior frontend engineer implementing the Feedback & Overlay System for ContentCraft AI, working in an existing Next.js codebase.

## Objective

Implement the complete Feedback & Overlay System, using `public/design-assets/design-system/Feedback & Overlay System.svg` as the single source of truth. Build every feedback and overlay component the SVG depicts, with every variant and interaction state it shows, and make each one fully functional and visually verified in the browser.

## Stack and Setup

Next.js, React, TypeScript, Tailwind CSS v4, shadcn/ui where it fits, and the project's existing icon library (lucide-react if already installed). Inspect the project's actual `package.json` and setup before assuming any of these.

## Phase 1: Design Inspection

Read the complete SVG, covering every section. Do not skip any part of it.

For each feedback and overlay component, record:
- Dimensions, spacing and alignment
- Typography and font weights
- Colours, backgrounds, borders, radii and shadows
- Icons and icon sizes
- Every state and variant
- Positioning and layering relative to page content and to other components

Do not invent components, variants or styles the reference does not show, and do not replace the reference with your own interpretation of it.

Then inspect the existing codebase: folder structure, naming conventions, design tokens, existing components (especially any that overlap with what the SVG shows), and installed libraries. Reuse existing tokens and components rather than introducing parallel ones, and do not duplicate components that already exist.

## Phase 2: Implementation

Implement the system one component at a time, verifying each before moving on. Each component must be:
- Reusable and properly typed in TypeScript
- Built on the existing architecture and naming conventions
- Styled with existing design tokens, not ad-hoc colours or spacing
- Layered correctly, with stacking order, positioning and overlay behaviour handled so components sit correctly against each other and against page content
- Animated with smooth transitions only where the design calls for them

Do not install a new library unless there is a clear technical reason, and state that reason in the final report if you do.

## Phase 3: Functional Behaviour

Every implemented component must actually work:
- Buttons trigger their intended actions.
- Dismissible elements can be dismissed.
- Overlays open and close correctly.
- Modals close on backdrop click and Escape where the design calls for it, move focus into the overlay on open, return focus to the trigger on close, and block background interaction while open.
- Keyboard navigation and focus states work throughout.

Implement only the interactions the SVG represents plus standard UI behaviour for them. Add nothing arbitrary.

## Phase 4: Visual Verification

Run the application and inspect the rendered components in the browser against the SVG. Check visual accuracy, spacing and alignment, typography, colours, icons, every component state, and layering and positioning.

Test at viewport widths of 375px, 390px, 768px, 1024px and 1440px. A passing build or lint check does not count as visual verification. Fix every discrepancy you find before moving on.

## Constraints

- Do not change the Landing Page or Signup Page unless a change is strictly required by this work.
- Do not change authentication, API routes, the database, Cognito, S3, or any backend logic.
- Do not alter unrelated design-system components.
- Keep all existing working functionality intact.

## Final Report

Finish with a report covering:
1. All components identified in the SVG
2. Components implemented
3. Files created and modified
4. Libraries and existing components reused (and the reason for any new dependency)
5. Functionality implemented
6. Responsive and browser verification results at each tested width
7. Any remaining gaps compared with the reference

Begin by inspecting the SVG and the codebase, then carry the work through to a working, verified implementation. Do not stop after producing an analysis.