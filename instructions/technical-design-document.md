# Technical Design Document — My Benefit (Fitness Tracker App)

_Last updated: 2025-10-20_  
_Author: Aliyon Tembo_

---

## MY BENEFIT — One-Sentence Pitch
A mood-aware fitness tracker that connects your workouts with your emotions — featuring a **Motivation Spin Cursor** that spins to deliver quick motivational boosts.

---

## 1. OVERVIEW

### Goal
- Help users see how their **mood influences performance** and vice versa.  
- Encourage daily engagement with subtle motivation cues.  
- Deliver a clean, fast MVP experience for both desktop and mobile users.

### Key Features
- Workout logging (type, duration, calories).  
- Mood tracking (emoji-based selector).  
- Insights dashboard (mood ↔ workout correlation).  
- **Motivation Spin Cursor**: A dynamic cursor animation that reveals motivational messages on hover/spin.  
- Firebase Authentication (email + Google).  

### Target Users & Success Criteria
- **Target users:** Fitness enthusiasts and mood trackers (18–35 yrs).  
- **Success criteria:**  
  - ≥ 70 % of test users log workouts at least 3× per week.  
  - < 2 s load time on mobile.  
  - Smooth cursor interactions (no lag, < 16 ms frame response).  

---

## 2. TECH STACK (GOLDEN PATH)

| Layer | Toolset |
| ----- | -------- |
| **Runtime** | Node (Firebase Gen 2 Cloud Functions) |
| **Language** | TypeScript (strict) |
| **Front-end** | React + Vite |
| **UI Kit** | shadcn/ui (Radix + Tailwind source-copy model) |
| **Styling** | Tailwind CSS (design-token file) |
| **State / Data Fetching** | TanStack Query |
| **Forms & Validation** | React Hook Form + Zod resolver |
| **Shared Validation** | Zod (client & server) |
| **API Layer** | tRPC (typed RPC) |
| **Backend Services** | Firebase Auth · Firestore · Storage · Functions |
| **Package Manager / Mono** | PNPM workspaces |
| **Build Orchestration** | Turborepo (remote caching) |
| **Component Workshop** | Storybook (UI in isolation) |
| **Tests** | Vitest + Testing Library · Playwright |
| **Linting / Formatting** | ESLint + Prettier + Perfectionist plugin |
| **Env Validation** | T3 Env (Zod-validated) |
| **Versioning / Publishing** | Changesets (monorepo releases) |
| **CI / CD** | GitHub Actions (Turbo-aware pipeline) |

---

## 3. MONOREPO LAYOUT (PNPM)

├── apps/
│ └── web/ ← React front-end (+ .storybook)
├── functions/ ← Cloud Functions / tRPC routers
├── packages/
│ ├── shared/ ← Zod schemas, utilities, common types
│ └── seeding/ ← Data-seeding helpers (Firestore emulator/Admin SDK)
├── docs/ ← Project docs (this TDD, ADRs, API notes)
└── .github/ ← CI workflows


---

## 4. ARCHITECTURE

**Flow:**  
React (client) ⇄ tRPC endpoints (Cloud Functions) ⇄ Firestore & Storage

**Motivation Spin Cursor subsystem:**  
Front-end animation uses Framer Motion + custom hook for physics spin.  
Randomized messages fetched from Firestore collection (`motivations`).

---

## 5. DATA MODEL

| Entity | Key Fields | Notes |
| ------- | ----------- | ----- |
| **User** | `uid`, `email`, `displayName`, `createdAt` | Auth via Firebase |
| **Workout** | `id`, `userId`, `type`, `duration`, `calories`, `timestamp` | CRUD via tRPC |
| **Mood** | `id`, `userId`, `emoji`, `intensity`, `timestamp` | One per day |
| **Motivation** | `id`, `text`, `tag`, `createdAt` | Used by spin cursor |

**Security rules:**
- Restrict reads/writes to authenticated users on their own docs.
- Admin-only access for `motivations` seed data.

**Indexes:**
- Composite index on `workouts.userId + timestamp`.
- Composite index on `moods.userId + timestamp`.

---

## 6. API DESIGN (tRPC)

| Router | Procedure | Input (Zod) | Output |
| ------- | ---------- | ----------- | ------- |
| `user` | `getById` | `{ uid: string }` | `User` |
| `workout` | `list`, `create`, `delete` | Workout schema | `Workout[]` |
| `mood` | `getToday`, `setMood` | Mood schema | `Mood` |
| `motivation` | `random` | none | `{ text: string }` |

**Error Handling**
- Auth errors → `UNAUTHORIZED`.  
- Validation errors → `BAD_REQUEST`.  
- Firestore failures → `INTERNAL_SERVER_ERROR`.  

---

## 7. TESTING STRATEGY

| Level / Focus | Toolset | Scope |
| -------------- | -------- | ------ |
| **Unit** | Vitest | Zod schemas, utility functions |
| **Component** | Vitest + Testing Library | UI components |
| **Visual / Interaction** | Storybook + @storybook/testing-library | UI snapshots, cursor spin |
| **End-to-End** | Playwright | Auth flows, happy paths |

**Coverage Target:** 80 % statements  
**Fixtures / Seeding:** `pnpm seed` → runs scripts against Firebase emulator.

---

## 8. CI / CD PIPELINE (GITHUB ACTIONS)

1. Setup PNPM and restore Turbo cache  
2. `pnpm exec turbo run lint typecheck`  
3. `pnpm exec turbo run test`  
4. `pnpm exec turbo run build-storybook`  
5. `pnpm exec turbo run e2e`  
6. Deploy preview (Firebase Hosting channel + Storybook host)  
7. Changesets release → promote to prod on merge to `main`

---

## 9. ENVIRONMENTS & SECRETS

| Env | URL / Target | Notes |
| ---- | ------------- | ------ |
| **local** | `localhost:5173` | Firebase emulators + `.env` validated by T3 Env |
| **preview-\*** | Firebase Hosting channel | Auto-created per PR |
| **prod** | `https://app.mybenefit.fit` | Promote via CI workflow |

Secrets managed via `firebase functions:config:set` and GitHub Actions secrets.

---

## 10. PERFORMANCE & SCALABILITY
- Denormalize Firestore data to avoid hot-document writes.  
- Tune TanStack Query (`staleTime`, prefetch).  
- Use Vite dynamic imports for code splitting.  
- Lazy-load cursor animation assets.  

---

## 11. MONITORING & LOGGING

| Concern | Tool | Notes |
| -------- | ---- | ------ |
| Runtime errors | Firebase Crashlytics / Sentry | Front-end error capture |
| Server logs | Google Cloud Logging | Structured JSON logs |
| Analytics | PostHog / GA4 | Tracks user engagement & cursor usage |

---

## 12. ACCESSIBILITY & I18N

- shadcn/ui components use Radix ARIA-compliant primitives.  
- Storybook a11y addon for quick audits.  
- WCAG 2.1 AA checklist applied (contrast, keyboard nav).  
- i18n planned via `react-intl`; language switcher in future release.  

---

## 13. CODE QUALITY & FORMATTING
- Prettier formats on save / commit.  
- ESLint (TypeScript-ESLint + Perfectionist plugin) sorts imports and object keys.  
- Husky pre-commit hook runs `lint-staged`.  

---

## 14. OPEN QUESTIONS / RISKS

| Item | Owner | Resolution Date |
| ----- | ------ | --------------- |
| AI personalization for motivation messages | Aliyon Tembo | TBD |
| Sync of offline workout data | Aliyon Tembo | TBD |
| PWA support | Aliyon Tembo | TBD |

---

## 15. APPENDICES

- **Setup script:** `pnpm exec turbo run setup`  
- **Branching model:** Conventional commits + Changesets for versioning.  
- **Links:** Product spec, Figma, Storybook URL, ADR index.  
- **Figma link:** _pending_  
- **Storybook URL:** `https://storybook.mybenefit.fit`

---

**End of Document**  
_Save as `docs/technical-design-doc.md` in the repository._
