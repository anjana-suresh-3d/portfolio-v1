# 3D Interior Designer Portfolio — Anjana Suresh

## Overview

Build a **fully custom, immersive 3D portfolio website** for interior designer **Anjana Suresh**. The site uses **Next.js 14+ (App Router)** with **React Three Fiber** for GPU-accelerated 3D scenes, includes an **admin panel** for managing projects/works, and is **hosted entirely on Vercel (free tier)**.

**Project Type:** WEB (Full-Stack)
**Style:** Sleek Minimal (black + white + gold accents)
**Primary Agent:** `frontend-specialist`

---

## Key Decisions

| Decision | Answer |
|----------|--------|
| **Brand Name** | Anjana Suresh |
| **Style** | Sleek minimal — black, white, gold accents |
| **3D Models** | SketchUp → export GLTF/GLB for web |
| **Design Files** | Deferred — images only for now |
| **Admin Panel** | ✅ YES — manage works, upload images |
| **Language** | English only |
| **Hosting** | Vercel (free tier) |

---

## SketchUp → Web 3D Pipeline

```
SketchUp Model
    ↓ Export as .gltf/.glb (via SketchUp extension or Blender bridge)
    ↓ Optimize in https://gltf.report/ (compress textures, Draco compression)
    ↓ Upload via Admin Panel → Vercel Blob storage
    ↓ Load in React Three Fiber <useGLTF>
    ↓ Render in browser at 60fps
```

> SketchUp can export to GLTF via the **"SketchUp to glTF"** extension or by exporting to **Collada (.dae)** and converting in Blender. Render 3D outputs can be used as environment textures/background images.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14+ (App Router) | SSG + API routes + Vercel-native |
| **3D** | `@react-three/fiber` + `@react-three/drei` | Declarative 3D, GLTF loader built-in |
| **Post-FX** | `@react-three/postprocessing` | Bloom, vignette, DoF |
| **Scroll** | GSAP + ScrollTrigger | Scroll-driven 3D camera + reveals |
| **UI Motion** | Framer Motion | Page transitions, micro-animations |
| **Styling** | CSS Modules (Vanilla CSS) | Full control, zero overhead |
| **Database** | Vercel Postgres (free: 256MB) | Projects, metadata storage |
| **ORM** | Prisma | Type-safe queries, migrations |
| **Auth** | NextAuth.js (credentials) | Single admin login, no OAuth needed |
| **Image Upload** | Vercel Blob (free: 250MB) | CDN-backed image/model storage |
| **Content** | DB-driven (not MDX) | Admin panel creates/edits projects |
| **Font** | Google Fonts: Outfit + DM Serif Display | Modern geometric + elegant serif |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  VERCEL                       │
│                                               │
│  ┌─────────────┐  ┌──────────────────────┐   │
│  │ Public Site  │  │   Admin Panel        │   │
│  │ (SSG/SSR)   │  │   /admin/*           │   │
│  │             │  │   (Auth-protected)    │   │
│  │  • Hero 3D  │  │   • Add/Edit Projects│   │
│  │  • Projects │  │   • Upload Images    │   │
│  │  • About    │  │   • Upload 3D Models │   │
│  │  • Contact  │  │   • Site Settings    │   │
│  └──────┬──────┘  └──────────┬───────────┘   │
│         │                    │                │
│         ▼                    ▼                │
│  ┌──────────────────────────────────────┐    │
│  │     Next.js API Routes (Serverless)  │    │
│  │     /api/projects, /api/upload,      │    │
│  │     /api/auth, /api/contact          │    │
│  └──────────┬───────────────┬───────────┘    │
│             │               │                │
│    ┌────────▼───┐   ┌──────▼──────┐         │
│    │  Vercel    │   │   Vercel    │         │
│    │  Postgres  │   │   Blob      │         │
│    │  (metadata)│   │  (images,   │         │
│    │            │   │   models)   │         │
│    └────────────┘   └─────────────┘         │
└─────────────────────────────────────────────┘
```

---

## File Structure

```
Portfolio-v1/
├── prisma/
│   └── schema.prisma          # DB schema (Project, Image, Settings)
├── public/
│   ├── textures/              # Environment maps, HDRI
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout (fonts, metadata)
│   │   ├── page.js            # Landing page
│   │   ├── projects/
│   │   │   ├── page.js        # All projects
│   │   │   └── [slug]/page.js # Project detail
│   │   ├── about/page.js
│   │   ├── contact/page.js
│   │   ├── admin/             # 🔒 Auth-protected
│   │   │   ├── layout.js      # Admin layout + auth check
│   │   │   ├── page.js        # Dashboard
│   │   │   ├── projects/
│   │   │   │   ├── page.js    # List/manage projects
│   │   │   │   ├── new/page.js    # Create new project
│   │   │   │   └── [id]/edit/page.js  # Edit project
│   │   │   ├── settings/page.js   # Site settings
│   │   │   └── login/page.js # Admin login
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.js
│   │       ├── projects/route.js      # CRUD projects
│   │       ├── upload/route.js        # Image/model upload
│   │       └── contact/route.js       # Contact form
│   ├── components/
│   │   ├── three/             # 3D components
│   │   │   ├── CanvasWrapper.jsx
│   │   │   ├── HeroScene.jsx
│   │   │   ├── RoomModel.jsx
│   │   │   ├── FloatingElements.jsx
│   │   │   ├── ParticleField.jsx
│   │   │   └── Lighting.jsx
│   │   ├── ui/                # Shared UI
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   └── ScrollProgress.jsx
│   │   ├── sections/          # Landing page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutPreview.jsx
│   │   │   ├── ProjectsShowcase.jsx
│   │   │   ├── ServicesSection.jsx
│   │   │   └── ContactCTA.jsx
│   │   ├── admin/             # Admin-specific components
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ModelUploader.jsx
│   │   │   └── DataTable.jsx
│   │   └── layout/
│   │       └── PageTransition.jsx
│   ├── lib/
│   │   ├── prisma.js          # Prisma client singleton
│   │   ├── auth.js            # NextAuth config
│   │   ├── blob.js            # Vercel Blob helpers
│   │   └── utils.js
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   ├── useMousePosition.js
│   │   └── useMediaQuery.js
│   └── styles/
│       ├── globals.css
│       ├── admin.css
│       └── animations.css
├── next.config.js
├── package.json
└── .env.local                 # DB URL, Blob token, NextAuth secret
```

---

## Database Schema (Prisma)

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  category    String                // e.g., "Living Room", "Bedroom", "Office"
  year        String
  location    String?
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  coverImage  String                // Blob URL
  images      Image[]
  modelUrl    String?               // GLTF/GLB Blob URL (optional)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Image {
  id        String  @id @default(cuid())
  url       String                  // Blob URL
  alt       String?
  order     Int     @default(0)
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model SiteSettings {
  id          String @id @default("default")
  heroTitle   String @default("Interior Design")
  heroSubtitle String @default("")
  aboutText   String @default("")
  email       String @default("")
  phone       String?
  instagram   String?
  linkedin    String?
}
```

---

## Task Breakdown

### Phase 1: Foundation

| # | Task | Verify |
|---|------|--------|
| 1.1 | Init Next.js 14+ (`npx create-next-app@latest ./`) | `npm run dev` works |
| 1.2 | Install deps: R3F, drei, postprocessing, GSAP, Framer Motion, Prisma, NextAuth, Vercel Blob | `package.json` updated |
| 1.3 | Create folder structure | Folders exist |
| 1.4 | Set up `globals.css` — design tokens: `--black: #0a0a0a`, `--white: #fafafa`, `--gold: #c9a96e`, spacing scale | Variables in dev tools |
| 1.5 | Configure fonts (Outfit + DM Serif Display) in `layout.js` | Fonts render |

### Phase 2: Database & Auth

| # | Task | Verify |
|---|------|--------|
| 2.1 | Set up Vercel Postgres + Prisma schema | `npx prisma db push` succeeds |
| 2.2 | Configure NextAuth with credentials provider (single admin account) | Login returns session |
| 2.3 | Create API routes: `projects` CRUD, `upload` (Blob), `contact` | API returns 200 on test |

### Phase 3: 3D Core

| # | Task | Verify |
|---|------|--------|
| 3.1 | `CanvasWrapper.jsx` — R3F Canvas, Suspense, adaptive DPR, perf monitor | Canvas renders |
| 3.2 | `HeroScene.jsx` — Procedural 3D room (geometric furniture), mouse-reactive camera | Room visible, mouse works |
| 3.3 | `Lighting.jsx` — Ambient + spot + env map | Scene well-lit |
| 3.4 | `FloatingElements.jsx` — Animated geometric shapes | Shapes float smoothly |
| 3.5 | `ParticleField.jsx` — Subtle ambient particles | Particles render at 60fps |
| 3.6 | Post-processing: subtle bloom + vignette | Effects visible |

### Phase 4: Landing Page

| # | Task | Verify |
|---|------|--------|
| 4.1 | `Navbar.jsx` — Minimal, transparent, scroll-aware | Nav works on scroll |
| 4.2 | `HeroSection.jsx` — Full viewport, 3D behind, "Anjana Suresh" typography | Hero fills screen |
| 4.3 | `AboutPreview.jsx` — Brief bio with scroll reveal | GSAP triggers |
| 4.4 | `ProjectsShowcase.jsx` — Featured projects from DB, hover effects | Projects load from DB |
| 4.5 | `ServicesSection.jsx` — Service cards with 3D/animated icons | Services render |
| 4.6 | `ContactCTA.jsx` + `Footer.jsx` | CTA + footer render |
| 4.7 | Wire GSAP ScrollTrigger to all sections | All sections animate |

### Phase 5: Project Pages

| # | Task | Verify |
|---|------|--------|
| 5.1 | `projects/page.js` — Grid with category filter (data from DB) | Projects list renders |
| 5.2 | `projects/[slug]/page.js` — Image gallery, description, optional 3D viewer | Detail page works |
| 5.3 | `about/page.js` + `contact/page.js` with form | Pages render, form submits |

### Phase 6: Admin Panel

| # | Task | Verify |
|---|------|--------|
| 6.1 | `admin/login/page.js` — Clean login form | Auth works |
| 6.2 | `admin/layout.js` — Sidebar layout, auth guard | Redirects if not logged in |
| 6.3 | `admin/page.js` — Dashboard with project count, quick actions | Dashboard renders |
| 6.4 | `admin/projects/page.js` — DataTable of all projects | List renders |
| 6.5 | `admin/projects/new/page.js` — ProjectForm + ImageUploader + ModelUploader | Create project + upload images works |
| 6.6 | `admin/projects/[id]/edit/page.js` — Edit existing project | Edit + save works |
| 6.7 | `admin/settings/page.js` — Edit site settings (hero text, socials, etc.) | Settings save to DB |

### Phase 7: Polish & Deploy

| # | Task | Verify |
|---|------|--------|
| 7.1 | `LoadingScreen.jsx` — Branded loader | Shows while 3D loads |
| 7.2 | Performance: `<PerformanceMonitor>`, dynamic imports, lazy 3D | FPS > 30 on mobile |
| 7.3 | Mobile responsive + reduced-motion fallback | Works on 375px+ |
| 7.4 | SEO: metadata, OG images, sitemap | Rich link previews |
| 7.5 | Deploy to Vercel, configure env vars | Live on production URL |

---

## Phase X: Verification

```powershell
npm run build
npm run lint
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/frontend-design/scripts/ux_audit.py .
python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000
```

### Manual Checks
- [ ] 3D hero renders and responds to mouse
- [ ] Scroll animations trigger smoothly
- [ ] Projects load from database
- [ ] Admin login → dashboard → create project → appears on public site
- [ ] Image upload works via admin
- [ ] Contact form submits successfully
- [ ] Mobile responsive, no 3D crashes
- [ ] No purple/violet colors (Purple Ban)
- [ ] No template/cliché layouts
