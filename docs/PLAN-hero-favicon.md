# Plan: Hero Redesign & Favicon Management

Redesign the Hero section for a cleaner look, add geometric cursor animations, and implement dynamic favicon management from the Admin panel.

## Proposed Changes

### 1. Hero Section Redesign
- **[MODIFY] [HeroSection.jsx](file:///r:/Works/Ammu/Portfolio-v1/src/components/sections/HeroSection.jsx)**
    - Remove the `scrollIndicator` section (Scroll text and ChevronDown icon).
- **[MODIFY] [HeroSection.module.css](file:///r:/Works/Ammu/Portfolio-v1/src/components/sections/HeroSection.module.css)**
    - Remove background, backdrop-filter, border, and box-shadow from `.content`.
    - Remove all `.scrollIndicator` styles and animations.

### 2. Cursor Geometric Animation
- **[NEW] [CursorShapes.jsx](file:///r:/Works/Ammu/Portfolio-v1/src/components/ui/CursorShapes.jsx)**
    - Create a component that renders floating geometric shapes that follow the cursor.
- **[MODIFY] [HeroSection.jsx](file:///r:/Works/Ammu/Portfolio-v1/src/components/sections/HeroSection.jsx)**
    - Add `<CursorShapes />` to the hero section.

### 3. Favicon Management
- **[MODIFY] [page.js](file:///r:/Works/Ammu/Portfolio-v1/src/app/admin/page.js)**
    - Add `site.favicon` field to `Global Settings` section in `CONTENT_SECTIONS`.
- **[MODIFY] [layout.js](file:///r:/Works/Ammu/Portfolio-v1/src/app/layout.js)**
    - Fetch the `site.favicon` path and update `metadata.icons`.

## Verification Plan

### Manual Verification
- Verify Hero redesign (no box, no scroll arrow).
- Check cursor geometric shapes.
- Test Favicon upload in Admin and verify browser update.
