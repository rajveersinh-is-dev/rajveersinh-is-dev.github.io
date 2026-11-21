# Rajveersinh Vishal Pardeshi — Mathematical Research Portfolio
### *Offline-First, Interactive, Production-Quality Academic Research Environment*

> **"Discovering Structure. Proving Ideas. Building the Future."**  
> *Independent Mathematical Researcher — Satara, Maharashtra, India (Age: 16)*

---

## 1. Overview & Architectural Philosophy

This platform is a bespoke, offline-first personal research portfolio and computational laboratory for **Rajveersinh Vishal Pardeshi**. Designed at the intersection of rigorous mathematical research, computational systems architecture, and digital generative art, it presents original mathematical preprints, compiler implementations, algorithm design suites, and interactive numerical simulations.

### Key Visual & Design Foundations
- **Predominantly Monochromatic Palette**: Deep black (`#07080a`), dark charcoal (`#11141a`, `#171b23`), and slate tones balanced with selective amber accents (`#f59e0b`, `#ff7700`).
- **Signature Interactive ASCII & Dithering Engine**: Real-time canvas physics with Hooke's spring displacement, directional velocity trails, 4x4 Bayer ordered dithering fields, and cursor-revealed Clifford attractor manifold topologies.
- **Strict Academic & Computational Honesty**: Zero fabricated credentials, unverified dates, synthetic benchmarks, or peer-review claims.
- **100% Offline-First Architecture**: Zero runtime CDNs, external font APIs, cloud databases, or telemetry services. Complete self-contained bundling with Service Worker PWA caching and relative-path static serving.
- **Local Vector PDF CV Generation**: Programmatically compiled via `jspdf` directly from the single source of truth (`src/data/`), accompanied by pre-rendered vector PDF artifacts.

---

## 2. System Architecture & Directory Layout

```
website/
├── public/
│   ├── favicon.svg                       # Bespoke simplicial hypergraph vector icon
│   ├── manifest.json                     # Offline PWA web app manifest
│   ├── sw.js                             # Cache-first offline Service Worker
│   └── Rajveersinh_Vishal_Pardeshi_CV.pdf # Pre-rendered vector academic CV PDF
├── scripts/
│   └── build-static-cv.ts                # Headless PDF compiler script
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── BrandIcons.tsx            # Clean SVG icons (GitHub, LinkedIn)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Responsive header & mobile navigation drawer
│   │   │   ├── Footer.tsx                # Verified records & attribution footer
│   │   │   └── CommandPalette.tsx        # Keyboard accessible command center (Ctrl+K)
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx           # Opening statement & interactive canvas mode switcher
│   │   │   ├── AboutSection.tsx          # First-person narrative, philosophy & education
│   │   │   ├── ResearchInterestsSection.tsx # Theoretical mathematics connected lattice
│   │   │   ├── ProjectsSection.tsx       # Core implementations (1-5) & repository directory
│   │   │   ├── PreprintsSection.tsx      # Zenodo preprints with citation extraction
│   │   │   ├── AchievementsSection.tsx   # Kaggle (7th, ongoing) & SOF IMO distinctions
│   │   │   ├── SkillsLandscapeSection.tsx# Intermediate capability clusters
│   │   │   ├── TimelineSection.tsx       # Chronological academic & research milestones
│   │   │   ├── ConnectionsGraphSection.tsx# Interactive topological research map
│   │   │   ├── PlaygroundSection.tsx     # 4 interactive math labs (Lorenz, CA, Julia, Homology)
│   │   │   └── ContactSection.tsx        # Direct contact & offline-honest inquiry form
│   │   └── visuals/
│   │       └── AsciiDitherCanvas.tsx     # Spring-physics ASCII & Bayer dithering engine
│   ├── context/
│   │   └── PreferencesContext.tsx        # Reading mode, visuals, command palette state
│   ├── data/
│   │   ├── profile.ts                    # Authoritative biography & philosophy
│   │   ├── education.ts                  # IIT Madras & school education data
│   │   ├── projects.ts                   # Specifications for all 11 projects
│   │   ├── publications.ts               # Zenodo preprint records & metadata
│   │   ├── achievements.ts               # Kaggle & Olympiad distinctions
│   │   ├── skills.ts                     # Intermediate proficiency clusters
│   │   ├── timeline.ts                   # Verified chronological milestones
│   │   ├── connections.ts                # Graph network topology nodes
│   │   ├── experience.ts                 # Family business technical management
│   │   ├── social.ts                     # Contact endpoints & social links
│   │   └── index.ts                      # Central aggregator & integrity validator
│   ├── test/
│   │   ├── setup.ts                      # Vitest DOM & canvas test stubs
│   │   ├── content.test.ts               # Strict content schema & honesty assertions
│   │   ├── cv.test.ts                    # Local PDF vector compilation tests
│   │   ├── offline.test.ts               # Zero-CDN & asset relative path verification
│   │   └── components.test.tsx           # Full application integration & interaction tests
│   ├── types/
│   │   └── content.ts                    # TypeScript interface contracts
│   ├── App.tsx                           # Root orchestrator
│   ├── index.css                         # Tailored typography, scanlines & scrollbars
│   └── main.tsx                          # DOM mount
├── dist/                                 # Production build output
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 3. Installation & Development

### Prerequisites
- **Node.js**: `v18.0.0` or later (tested on Node `v24.18.0`)
- **npm**: `v9.0.0` or later

### Setup Instructions
1. Open terminal in the project directory:
   ```bash
   cd c:/Users/davea/OneDrive/Desktop/website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the local address displayed in terminal (typically `http://localhost:5173`).

---

## 4. Production Build & Static Serving

To generate an optimized, self-contained offline build:
```bash
npm run build
```
This single command executes:
1. TypeScript strict type-checking (`tsc -b`).
2. Vite production bundling and minification.
3. Automated compilation of the authoritative academic CV PDF to `dist/Rajveersinh_Vishal_Pardeshi_CV.pdf`.

### Previewing the Production Build
```bash
npm run preview
```
Or serve `dist/` with any standard static HTTP server (e.g. `npx serve dist`).

---

## 5. Offline-First Verification

The application is rigorously tested to ensure 100% offline operational independence:
1. **Network Disconnection Test**:
   - Build the site (`npm run build`).
   - Disconnect Wi-Fi/Ethernet.
   - Run `npm run preview` or open `dist/` on a local static server.
   - The entire website, interactive ASCII/dither engines, mathematical playground, command palette, and CV download function flawlessly with zero network traffic.
2. **Automated Offline Test**:
   - Run `npm run test` to execute `src/test/offline.test.ts`. This verifies that `dist/index.html` contains zero remote `http://` or `https://` script, link, or image dependencies.

---

## 6. How to Edit & Extend Content

All text, projects, publications, education, and milestones are driven by typed configuration files in `src/data/`. **You do not need to edit React components to update content.**

### A. Updating Profile & Philosophy
Edit `src/data/profile.ts`:
```typescript
export const profileData: ProfileData = {
  fullName: "Rajveersinh Vishal Pardeshi",
  age: 16,
  location: "Satara, Maharashtra, India",
  tagline: "Discovering Structure. Proving Ideas. Building the Future.",
  // ...
};
```

### B. Adding a New Project
Edit `src/data/projects.ts` and append an entry conforming to `ProjectEntry`:
```typescript
{
  id: "new-system",
  name: "New System Name",
  conciseDescription: "Description of the mathematical or computational engine.",
  category: "Compiler Theory",
  technologies: ["Rust", "Lean 4"],
  motivation: "The theoretical and engineering motivation.",
  keyIdeas: ["Core principle 1", "Core principle 2"],
  status: "Active Research",
  githubUrl: "https://github.com/...",
  isFeatured: true, // Set to true to include in top priority showcase
  priority: 12,
  verified: true
}
```

### C. Adding a Research Preprint
Edit `src/data/publications.ts`:
```typescript
{
  id: "zenodo-new",
  title: "Manuscript Title",
  shortAbstract: "Summary of mathematical findings and topological proofs.",
  researchArea: "Algebraic Topology",
  status: "Preprint", // Strictly marked as preprint
  authors: ["Rajveersinh Vishal Pardeshi"],
  recordUrl: "https://zenodo.org/records/...",
  isPeerReviewed: false,
  verified: true
}
```

### D. Updating Achievements (e.g. Kaggle rank)
Edit `src/data/achievements.ts`:
- Adjust the `description` or `details` fields (e.g. updating the current reported rank).

### E. Regenerating the Curriculum Vitae (PDF)
Whenever content in `src/data/` is updated, the PDF CV can be recompiled in two ways:
1. **Command line**:
   ```bash
   npm run build:cv
   ```
2. **Via Web Interface**: Clicking **"CV (PDF)"** in the header or hero triggers client-side vector compilation on-the-fly directly from the active typed dataset.

---

## 7. Testing & Quality Assurance

Run the comprehensive automated test suite with Vitest:
```bash
npm run test
```

### Test Suite Coverage:
- `src/test/content.test.ts`: Enforces strict data integrity, verifying age (16), IIT Madras enrolment details, school education, preprints peer-review honesty, priority 1-5 projects, and intermediate skill reporting.
- `src/test/cv.test.ts`: Verifies programmatic PDF construction, page counts, vector text layout, and binary header validity (`%PDF-`).
- `src/test/offline.test.ts`: Audits the production build for complete absence of remote network requests.
- `src/test/components.test.tsx`: Tests UI component rendering, modal dialog interactions, and mathematical playground tab switching.

---

## 8. Academic & Engineering Integrity Guarantees

In accordance with strict computational honesty standards:
- **No Fabricated Credentials**: Only verified education (IIT Madras BSc Aerospace enrolment, Eon Gyanankur Class XII) and practical experience (OnlineAirgun.com website management and security testing) are included.
- **Preprints Distinct from Formal Journals**: Preprints are clearly labeled as independently authored preprints without peer-review claims.
- **Ongoing Competitions**: The Kaggle Squares in Squares rank is explicitly designated as an active leaderboard standing during an ongoing competition.
- **Intermediate Competency**: Technical competencies are displayed as structured topological clusters without arbitrary numerical percentage meters.
- **Physical & Simulation Transparency**: The Terrain Erosion Engine and dynamical systems simulations are derived strictly from canonical discrete approximations without inflated performance or accuracy claims.
