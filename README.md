# Strava-Inspired Fitness & Outdoor Activity Application

A mobile-first fitness and outdoor activity tracking application inspired by Strava, built with React Native, Expo SDK 58, Expo Router, and TypeScript. Designed for recording outdoor workouts (running, cycling, hiking), tracking GPS routes, capturing metrics (pace, elevation, distance), and analyzing activity performance.

---

## 1. Environment & Stack Specifications

- **Application Name:** `Fitness Activity` (provisional)
- **Expo Slug:** `fitness-activity`
- **Application Version:** `1.0.0`
- **URL Scheme:** `fitnessactivity://`
- **Android Package Identifier:** `com.example.fitnessactivity`
- **iOS Bundle Identifier:** `com.example.fitnessactivity`
- **Workspace Location:** `D:\projects_mobile\step_counter\project`
- **Expo SDK Version:** `58` (`~58.0.26`)
- **React Native Version:** `0.88.1`
- **React Version:** `19.3.0`
- **Language:** TypeScript (`~6.0.3`)
- **Navigation:** Expo Router (`~58.0.32`, file-based routing with `expo-router/native-tabs`)
- **Native Modules:** `expo-location` (`~58.0.22`), `expo-task-manager` (`~58.0.14`), `expo-sqlite` (`~58.0.18`)
- **Schema Validation:** `zod` (`^4.6.7`)
- **Testing:** Jest (`~30.5.2` with `jest-expo ~58.0.15`), React Native Testing Library (`^14.1.0`)
- **Linter & Formatter:** ESLint 9 (`^9.39.5` Flat Config with `eslint-config-expo`), Prettier (`^3.10.1`)
- **Node.js Runtime:** `v24.21.0` (minimum supported: `>= 22.13.0`)
- **npm Version:** `11.19.0`
- **Package Manager:** `npm` (with `package-lock.json`)
- **Java Runtime:** Eclipse Temurin OpenJDK `17.0.12+7` (`JAVA_HOME: C:\tools\jdk-17.0.12+7`)
- **Host OS:** Microsoft Windows 11 Pro 64-bit

---

## 2. Navigation Architecture Overview

The application utilizes **Expo Router** with strict file-based routing and SDK 58 native tab navigation:

1. **Root Stack Navigator (`src/app/_layout.tsx`):**
   Encapsulates global theme providers (`DarkTheme` / `DefaultTheme`), executes synchronous environment validation via `@/config/env`, coordinates splash screen dismissal, and mounts the primary route groups.
2. **Root Entry Redirect (`src/app/index.tsx`):**
   Automatically redirects the root path `/` to the Feed tab (`/(tabs)/feed`). Authentication gating is omitted in this architectural phase.
3. **Five-Tab Application Shell (`src/app/(tabs)/_layout.tsx`):**
   Implemented using the stable SDK 58 `expo-router/native-tabs` API (`NativeTabs` and `NativeTabs.Trigger`). Features platform-adaptive icons with iOS SF Symbols, Android Material Symbols, and Web fallback rendering.
4. **Authentication Route Group (`src/app/(auth)/_layout.tsx`):**
   Isolated stack navigator hosting lightweight authentication entry points without obstructing root tab navigation.
5. **Dynamic Activity Detail Route (`src/app/activity/[id].tsx`):**
   Dynamic stack route accepting typed activity IDs with native back-navigation integration.
6. **Not-Found Route (`src/app/+not-found.tsx`):**
   Catch-all 404 handler with a direct return link to the Feed tab.

---

## 3. Source Folder Architecture

The source code is organized following a feature-based architecture with layered separation of concerns. Detailed architectural rules, dependency flows, and guidelines are documented in [docs/architecture/folder-structure.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/folder-structure.md).

```
src/
├── app/                     # Routing layer (Expo Router file-based screens)
├── config/                  # Runtime environment schema & configuration (Zod)
├── features/                # Domain feature modules (screens, components, hooks)
│   ├── activities/          # Workout history & telemetry analysis
│   ├── auth/                # Sign-in, sign-up, session handling
│   ├── explore/             # Route discovery & segment exploration
│   ├── feed/                # Social timeline & athlete workout feed
│   ├── goals/               # Weekly/monthly training goals & challenges
│   ├── maps/                # Interactive map rendering & route polylines
│   ├── notifications/       # Push notifications & workout alerts
│   ├── profile/             # Athlete bio, gear locker & settings
│   ├── progress/            # Training statistics & personal records (PRs)
│   ├── recording/           # Real-time GPS workout tracking & auto-pause
│   ├── sharing/             # Instagram/Strava-style card snapshot graphics
│   └── social/              # Athlete following, kudos, and comments
├── components/              # Shared design system & layout primitives
│   ├── ui/                  # Atomic interface components (ThemedText, ThemedView)
│   └── layout/              # Structural screen scaffolds
├── services/                # Device APIs (Location, Sync, Media, Notifications)
├── repositories/            # Data access abstractions (Activity, Profile, Social)
├── database/                # SQLite migrations & schema definitions
├── stores/                  # Reactive Zustand stores (Recording, Auth, Sync)
├── hooks/                   # Shared non-domain React hooks
├── utilities/               # Pure formatting & mathematical functions (pace, distance)
├── types/                   # Cross-cutting TypeScript definitions
├── constants/               # Theme tokens, spacing, and application constants
└── tests/                   # Testing suite (unit, integration, fixtures, helpers)
```

---

## 4. Application Configuration & Environment Setup

Detailed configuration decisions, permission explanations, and security guidelines are documented in [docs/architecture/app-configuration.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/app-configuration.md).

### Environment Files

1. Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. Supported environment variables:
   ```env
   EXPO_PUBLIC_APP_ENV=development

   # Optional in Phase 01 (validated during startup when provided)
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   ```
3. Runtime validation is enforced via Zod in `src/config/env.ts` during application startup in `src/app/_layout.tsx`. If an invalid URL or asymmetric Supabase config is detected, application startup fails with a clear, sanitized error message.

### Location Permissions Setup

- **Foreground (iOS/Android):** Explains workout route and pace measurement to the athlete.
- **Background (iOS):** Declared for seamless workout recording when the display is locked or the app is minimized (activated in Phase 04).

---

## 5. Design System & Development Standards

- **Phase 01 Completion Record:** Documented in [docs/architecture/phase-1-completion.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/phase-1-completion.md).
- **Architecture Decision Records (ADRs):** Documented in [docs/adr/README.md](file:///D:/projects_mobile/step_counter/project/docs/adr/README.md).
- **Design System & Theme Tokens:** Documented in [docs/architecture/design-system.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/design-system.md).
- **Code Standards & Tooling:** Documented in [docs/architecture/code-standards.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/code-standards.md).
- **Git & CI Workflow:** Documented in [docs/development/git-workflow.md](file:///D:/projects_mobile/step_counter/project/docs/development/git-workflow.md).

### Development Scripts

| Command                | Action                                   | Description                                        |
| :--------------------- | :--------------------------------------- | :------------------------------------------------- |
| `npm run start`        | `expo start`                             | Starts the Metro development server                |
| `npm run android`      | `expo start --android`                   | Starts Metro with Android emulator target          |
| `npm run ios`          | `expo start --ios`                       | Starts Metro with iOS simulator target             |
| `npm run web`          | `expo start --web`                       | Starts Metro with web browser target               |
| `npm run typecheck`    | `tsc --noEmit`                           | Runs full strict TypeScript compiler verification  |
| `npm run lint`         | `eslint .`                               | Runs ESLint analysis across the project            |
| `npm run lint:fix`     | `eslint . --fix`                         | Automatically fixes auto-fixable lint issues       |
| `npm run format`       | `prettier --write .`                     | Formats all files using Prettier                   |
| `npm run format:check` | `prettier --check .`                     | Verifies code formatting without modifying files   |
| `npm test`             | `jest --runInBand`                       | Runs the test suite                                |
| `npm run test:watch`   | `jest --watch`                           | Runs Jest tests in interactive watch mode          |
| `npm run test:ci`      | `jest --ci --runInBand`                  | Runs Jest in deterministic CI mode                 |
| `npm run validate`     | `typecheck + lint + format:check + test` | Unified quality gate for PRs and pre-commit checks |
| `npm run clean`        | Cross-platform cache clean               | Cleans the local `.expo` cache directory           |

---

## 6. Application Route Tree

```
src/app/
├── _layout.tsx              # Root Stack Navigator & ThemeProvider
├── index.tsx                # Root entry point -> Redirects to /(tabs)/feed
├── +not-found.tsx           # Global 404 Not Found screen
│
├── (auth)/                  # Authentication route group (Stack Navigator)
│   ├── _layout.tsx          # Auth stack configuration
│   ├── sign-in.tsx          # Sign-in placeholder screen
│   ├── sign-up.tsx          # Account creation placeholder screen
│   └── forgot-password.tsx  # Password recovery placeholder screen
│
├── (tabs)/                  # Main application navigation (NativeTabs)
│   ├── _layout.tsx          # 5-tab native configuration with SF & Material symbols
│   ├── feed.tsx             # 1. Feed: Social workout activities & kudos
│   ├── explore.tsx          # 2. Explore: Route discovery, maps, and segments
│   ├── record.tsx           # 3. Record: GPS activity recording (disabled button)
│   ├── progress.tsx         # 4. Progress: Weekly training stats & PR milestones
│   └── profile.tsx          # 5. Profile: Athlete bio & links to auth screens
│
└── activity/                # Activity detail route group
    └── [id].tsx             # Dynamic activity detail view (/activity/:id)
```

---

## 7. Route Descriptions

### Main Navigation Tabs (`src/app/(tabs)/`)

| Tab Name     | Route              | iOS SF Symbol                          | Android Material Symbol | Description                                                                                                                   |
| :----------- | :----------------- | :------------------------------------- | :---------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **Feed**     | `/(tabs)/feed`     | `flame` / `flame.fill`                 | `feed`                  | Social activity feed displaying athlete workouts, kudos, and comments. Includes sample link to `/activity/act-sample-101`.    |
| **Explore**  | `/(tabs)/explore`  | `safari` / `safari.fill`               | `explore`               | Route discovery, trail search, local segment leaderboard highlights, and interactive map exploration.                         |
| **Record**   | `/(tabs)/record`   | `record.circle` / `record.circle.fill` | `fiber_manual_record`   | Activity recording interface with a disabled record button placeholder. GPS and background tracking are disabled in Phase 01. |
| **Progress** | `/(tabs)/progress` | `chart.bar` / `chart.bar.fill`         | `trending_up`           | Athlete training stats, weekly mileage charts, personal records (PRs), and workout frequency.                                 |
| **Profile**  | `/(tabs)/profile`  | `person` / `person.fill`               | `person`                | Athlete bio, lifetime statistics, gear tracker, and links to authentication screens.                                          |

### Authentication Routes (`src/app/(auth)/`)

- **Sign In (`/(auth)/sign-in`):** Entry screen for returning athletes. Contains cross-links to Sign Up, Forgot Password, and back to Feed.
- **Sign Up (`/(auth)/sign-up`):** Account registration screen. Links to Sign In and Feed.
- **Forgot Password (`/(auth)/forgot-password`):** Password reset placeholder. Links to Sign In and Feed.

### Dynamic & Utility Routes

- **Activity Detail (`/activity/[id]`):** Reads `id` via `useLocalSearchParams<{ id: string }>()`, handles missing IDs gracefully, and provides a stack back button.
- **Not Found (`/+not-found`):** Catches unmatched URLs and returns HTTP 404 with a link back to `/(tabs)/feed`.

---

## 8. Development Server Instructions

To run the application using Windows PowerShell:

```powershell
# Install dependencies from lockfile
npm ci

# Run quality checks
npm run validate

# Start the Expo development server
npm run start

# Clear Metro cache if switching branch or routes
npm run clean
npm run start -c
```

### Mobile Testing via Expo Go

1. Connect your Android or iOS device to the same Wi-Fi network as your PC.
2. Open the **Expo Go** application.
3. Scan the QR code displayed in the PowerShell terminal.

---

## 9. Current Navigation & Native Limitations

1. **Authentication Protection Deferred:**
   The application intentionally bypasses authentication checks and opens directly to `/(tabs)/feed`. Real authentication state, session storage, and route guarding will be integrated with Supabase in Phase 03.
2. **GPS & Sensors Disabled:**
   The Record tab displays a disabled placeholder button. `expo-location` and `expo-task-manager` are installed, but runtime permissions and tracking services will be activated in Phase 04.
3. **Database Uninitialized:**
   `expo-sqlite` is installed, but migrations and local stores are deferred to Phase 02.
4. **Map Rendering Deferred:**
   The Explore tab does not yet initialize Mapbox, Google Maps, or Apple Maps; interactive map integration is scheduled for Phase 05.
5. **Local Android Native Builds Unavailable:**
   Because Android Studio and the Android SDK are not installed on this host, running `npx expo run:android` locally is not verified. Mobile testing is supported via Expo Go on physical devices.
6. **iOS Native Compilation:**
   Requires macOS with Xcode. iOS testing on Windows is supported through the Expo Go client or cloud-based EAS Build.

---

## 10. Diagnostic & Verification Commands

```powershell
# Run the complete test suite
npm test

# Run strict TypeScript type checks
npm run typecheck

# Run ESLint lint checks
npm run lint

# Run Prettier formatting validation
npm run format:check

# Run Expo Doctor diagnostics
npx expo-doctor

# Inspect public Expo configuration
npx expo config --type public

# Check Expo dependency alignment
npx expo install --check
```
