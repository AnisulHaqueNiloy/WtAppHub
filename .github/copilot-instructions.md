# WtAppHub AI Coding Agent Instructions

## Project Overview
WtAppHub is a React + TypeScript + Vite frontend application for "SenderPro" - a SMS/message broadcasting platform. The app allows users to manage bulk messaging operations with an auth-based workflow.

**Tech Stack:**
- React 19 with TypeScript 5.9 (strict mode enabled)
- Vite 7 for fast builds/HMR
- Tailwind CSS 4.1 with Vite plugin
- React Router 7 for navigation
- Lucide React for icons
- LocalForage for client-side persistence

## Architecture

### Router Structure (`src/router.tsx`)
```
ParentLayout (root outlet)
├── /signup (default)
├── /login
└── /dashboard (nested outlet)
    ├── /dashboard (main)
    ├── /dashboard/analytics
    └── /dashboard/history
```
- **ParentLayout** is the root layout with `<Outlet>` for child routes
- Dashboard uses nested routing with **DashboardLayout** wrapping Analytics/History/Dashboard sub-routes
- Desktop/mobile responsive sidebar auto-closes on route navigation (see `DashboardLayout.tsx` line 18-20)

### Component Architecture
- **Auth Layer:** `Login.tsx`, `Signup.tsx` - form-based auth (currently dummy implementations)
- **Dashboard Layer:** `Dashboard.tsx` (main) → handles CSV uploads, message sending with contact list state
- **Layout Layer:** `DashboardLayout.tsx` (sidebar nav), `ParentLayout.tsx` (root outlet)
- All styling uses **Tailwind CSS** with custom Glassmorphism patterns (`bg-white/80 backdrop-blur-xl`)

### State Management Pattern
- Local component state only (useState) - no global state library currently used
- Dashboard uses interface-based typing for data: `Contact { number, status: "pending"|"sending"|"sent"|"failed" }`
- CSV parsing is stubbed with dummy data in `Dashboard.tsx`

## Build & Development Workflow

**Commands:**
```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript build + Vite bundle to dist/
npm run lint      # ESLint check (no --fix auto-applied)
npm run preview   # Preview production build locally
```

**Build Process:** `tsc -b` runs before `vite build` to catch type errors first (tsconfig.app.json strict mode)

**Development:** Vite HMR enabled - file saves auto-refresh browser

## Code Standards & Patterns

### TypeScript Configuration
- **Strict mode enabled** - all options in tsconfig.app.json (noImplicitAny, strict, etc.)
- Target: ES2022, JSX: react-jsx
- `noUnusedLocals` and `noUnusedParameters` enforced - remove dead code immediately
- `skipLibCheck: true` for faster compilation

### ESLint Rules
- `typescript-eslint` recommended + React Hooks rules + React Refresh plugin
- No auto-fix enabled on build - violations must be corrected manually
- **Key violations to avoid:** React dependency array warnings, stale closures, unused variables

### Form Patterns
- Use `useState` for form data (see `Signup.tsx` lines 12-17)
- Inline `React.ChangeEvent<HTMLInputElement>` typing for inputs
- `e.preventDefault()` on form submissions
- Link navigation uses `react-router-dom` `<Link>` (not `<a>` tags)

### Styling Conventions
- **Tailwind-only** - no separate CSS modules (except global `index.css` and `App.css`)
- Glassmorphism pattern: `bg-white/80 backdrop-blur-xl rounded-[2.5rem]` (see Login/Signup)
- Decorative animated backgrounds: positioned fixed pseudo-elements with `blur-[120px]` radial gradients
- Color scheme: Blue-600 primary, slate grays for text, indigo/blue accents

### Component Patterns
- Functional components with `React.FC` implicit typing
- Props destructuring inline (no separate interface exports unless reusable)
- Inline icon imports from `lucide-react` - add as needed
- Mobile-first responsive: `md:` breakpoints for tablet+, `px-4` padding for mobile

## Critical Integration Points

### File I/O & CSV Parsing
- **Location:** `Dashboard.tsx` lines 25-35 - stubbed with dummy data
- **Pattern:** `HTMLInputElement.files[0]` reading not yet implemented; replace dummy data with actual parsing
- **Expected structure:** Array of `Contact` objects with phone numbers

### Navigation & Route Guards
- No auth guards implemented - routes are public
- Dashboard sub-pages accessible directly (e.g., `/dashboard/analytics`)
- **Implement guard:** Add middleware in `router.tsx` if auth required

### Local Storage
- `localforage` imported but not used - available for persistent contact lists or preferences
- **Usage:** `localforage.setItem(key, value)` for cross-tab persistence

## Development Gotchas

1. **Mobile sidebar:** Closes automatically on route change via `useLocation()` - don't remove this pattern
2. **Unused variables:** TypeScript will fail build if form inputs or props unused - remove or use
3. **HMR refresh:** Component default exports required by router - avoid named exports in route components
4. **Tailwind classes:** Dynamically generated classes (e.g., `[#F1F5F9]`) work with v4 - no JIT config needed

## Common Tasks

**Add new route:**
1. Create component in appropriate folder (`src/Dashboard/` or `src/`)
2. Add to router.tsx with path and element
3. Add menu item to `DashboardLayout.tsx` menuItems array if dashboard sub-page

**Add form field:**
1. Update `useState` object in component
2. Add `handleChange` input binding
3. Update TypeScript interface if needed
4. Add input JSX with `name` matching state key

**Fix TypeScript errors:**
- Run `npm run build` to see type errors
- Check tsconfig.app.json strict flags - don't loosen them
- Use proper typing: `Contact[]`, `React.ChangeEvent<HTMLInputElement>`, etc.
