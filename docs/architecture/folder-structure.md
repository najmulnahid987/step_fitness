# Source Folder Architecture & Module Organization

**Project:** Strava-Inspired Fitness & Outdoor Activity Application  
**Framework:** React Native / Expo SDK 58 / Expo Router  
**Target:** iOS, Android, and Web

---

## 1. Overall Architecture Overview

The application architecture follows a **feature-sliced, layered design** optimized for mobile scalability, cross-platform performance, and long-term maintainability. It cleanly decouples the routing shell from domain logic, data persistence, and shared UI primitives.

### High-Level Architectural Flow

```
┌────────────────────────────────────────────────────────┐
│               Routing Layer (src/app/)                 │
│         Expo Router file-based screens & layouts       │
└───────────────────────────┬────────────────────────────┘
                            │ delegates to
┌───────────────────────────▼────────────────────────────┐
│          Feature Layer (src/features/<feature>/)       │
│    Screens, feature components, domain hooks, contracts│
└─────────────┬───────────────────────────┬──────────────┘
              │ uses                      │ uses
┌─────────────▼─────────────┐ ┌───────────▼──────────────┐
│  State Layer (src/stores) │ │ Application Services     │
│   Zustand reactive stores │ │   (src/services/)        │
└─────────────┬─────────────┘ └───────────┬──────────────┘
              │                           │
┌─────────────▼───────────────────────────▼──────────────┐
│         Repository Layer (src/repositories/)           │
│         Data access abstractions & caching             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      Database & Persistence (src/database/)            │
│       Local SQLite schemas, migrations & Supabase      │
└────────────────────────────────────────────────────────┘

Shared Cross-Cutting Infrastructure (Available to All Layers):
├── src/components/ui/      (Atomic design primitives)
├── src/components/layout/  (Screen scaffolds & safe area wrappers)
├── src/constants/          (Theme tokens, typography, spacing)
├── src/hooks/              (Reusable utility hooks)
├── src/types/              (Global domain definitions)
└── src/utilities/          (Pure functions, formatters, unit math)
```

---

## 2. Dependency Direction Rules

Dependencies flow in a strictly one-directional hierarchy:

$$\text{Routes} \longrightarrow \text{Features} \longrightarrow \text{State / Services} \longrightarrow \text{Repositories} \longrightarrow \text{Database}$$

### Strict Dependency Rules

1. **Shared Components are Agnostic:**  
   Components in `src/components/ui` and `src/components/layout` **must never** import from `src/features/*`, `src/services/*`, or `src/repositories/*`. They only receive data via standard React props.
2. **Repositories are UI-Free:**  
   Repositories (`src/repositories/`) and database schemas (`src/database/`) **must never** import React, React Native components, or JSX. They are pure TypeScript modules.
3. **Utilities are Pure:**  
   Modules in `src/utilities/` are platform-independent pure functions (e.g., pace math, distance conversions) and must not depend on UI libraries or store state.
4. **Thin Routing:**  
   Route files in `src/app/` remain thin delegates that mount feature screens or container components rather than containing extensive business logic.
5. **No Cross-Feature Entanglement:**  
   Feature modules (e.g., `features/feed`) should not import internal private components from another feature (e.g., `features/recording`). Cross-feature data sharing occurs through application services, reactive stores, or shared contracts.

---

## 3. Directory Responsibilities

### A. `src/app/` (Expo Router Routing Layer)

The `src/app/` directory is exclusively dedicated to file-based routing and navigation configuration.

- **`(tabs)/`**: Five-tab native navigation (`feed.tsx`, `explore.tsx`, `record.tsx`, `progress.tsx`, `profile.tsx`).
- **`(auth)/`**: Modal/stack authentication routes (`sign-in.tsx`, `sign-up.tsx`, `forgot-password.tsx`).
- **`activity/[id].tsx`**: Dynamic activity detail view.
- **`_layout.tsx`**: Root stack configuration, theme provider, and splash screen handling.
- **`index.tsx`**: Root entry point redirecting to `/(tabs)/feed`.
- **`+not-found.tsx`**: Global catch-all 404 handler.

### B. `src/features/` (Domain Feature Modules)

Each feature represents a self-contained domain capability of the fitness application:

| Feature Directory         | Domain Responsibility                                                               |
| :------------------------ | :---------------------------------------------------------------------------------- |
| `features/auth/`          | User authentication, session lifecycles, sign-in/up forms, password reset.          |
| `features/feed/`          | Social activity feed, workout timeline cards, athlete kudos, comment threads.       |
| `features/explore/`       | Trail discovery, local segment exploration, route filtering, search.                |
| `features/recording/`     | Real-time workout tracking, stopwatch controls, GPS location listeners, auto-pause. |
| `features/activities/`    | Workout history, activity telemetry analysis, elevation charts, split times.        |
| `features/maps/`          | Interactive map rendering, GPS route polylines, start/finish markers, heatmaps.     |
| `features/social/`        | Athlete following/followers, athlete search, activity notifications, social clubs.  |
| `features/profile/`       | Athlete profiles, gear locker (shoes, bicycles), lifetime totals, settings.         |
| `features/progress/`      | Fitness statistics, weekly mileage charts, personal records (PRs), training goals.  |
| `features/sharing/`       | Instagram/Strava-style activity image card generation, overlay graphics, sharing.   |
| `features/goals/`         | Monthly/weekly distance and elevation goals, challenge achievements, badges.        |
| `features/notifications/` | Push notifications, workout reminders, kudo alerts, background sync notices.        |

#### Standard Feature Subfolder Structure

When a feature requires internal organization, it uses standardized subdirectories:

- `components/`: Feature-specific UI elements (e.g., `WorkoutMetricCard.tsx`, `KudoButton.tsx`).
- `screens/`: Composite screen views mounted by route files.
- `hooks/`: Domain hooks (e.g., `useActiveRecording.ts`, `usePaceCalculator.ts`).
- `services/`: Feature-level business operations.
- `types/`: Feature-specific TypeScript interfaces and models.

### C. `src/components/` (Shared UI Layer)

- **`ui/`**: Reusable design primitives (e.g., `themed-text.tsx`, `themed-view.tsx`, buttons, badges, modals).
- **`layout/`**: Structural layout components (e.g., screen containers, safe-area wrappers, grid layouts).

### D. `src/services/` (Application Services)

Cross-cutting application services that coordinate between hardware, device APIs, and background processes:

- `location.service.ts`: Background & foreground GPS polling, geofencing, accuracy filtering.
- `sync.service.ts`: Offline SQLite to cloud Supabase synchronization.
- `notification.service.ts`: Expo push token management, local scheduled notifications.
- `media.service.ts`: Camera access, photo compression, storage upload.

### E. `src/repositories/` (Data Access Abstractions)

Provides clean data access interfaces that isolate the UI and business logic from raw SQL or API calls:

- `activity.repository.ts`: CRUD operations for workouts, coordinate streams, and summary statistics.
- `profile.repository.ts`: Local and remote user profile fetching and updates.
- `social.repository.ts`: Kudos, comments, and follower graph data access.
- `goal.repository.ts`: Goal progression tracking and streak calculation.

### F. `src/database/` (Local & Remote Storage Infrastructure)

- **`schemas/`**: Table definitions, ORM models, and Supabase database types.
- **`migrations/`**: Incremental SQL migration scripts for local SQLite database versioning.

### G. `src/stores/` (Global State Management)

Centralized reactive state managed via lightweight Zustand stores:

- `recording.store.ts`: Current workout state, active GPS coordinates, timer, paused/resumed status.
- `auth.store.ts`: Current session, authenticated user profile, auth token.
- `preferences.store.ts`: User unit preference (metric vs. imperial), theme mode, audio cues.
- `sync.store.ts`: Pending offline mutation queue and sync progress.

### H. `src/hooks/` (Shared Utility Hooks)

General-purpose React hooks not tied to a specific domain:

- `use-theme.ts`: Access active light/dark color palette.
- `use-color-scheme.ts`: Platform color-scheme listener.
- `use-network-status.ts`: Online/offline connectivity listener.
- `use-debounce.ts`: Input debouncer for search fields.

### I. `src/utilities/` (Pure Helper Functions)

Stateless mathematical and formatting helpers:

- `distance.ts`: Haversine formula, meters to kilometers/miles conversion.
- `pace.ts`: Pace per km/mile calculations, moving time vs. elapsed time.
- `formatters.ts`: Date/time formatters, duration string formatters (`hh:mm:ss`).
- `elevation.ts`: Cumulative elevation gain and smoothing algorithms.

### J. `src/types/` (Shared TypeScript Contracts)

Global shared contracts across layers:

- `activity.types.ts`: Base Activity, SportType enum (`run`, `ride`, `walk`, `hike`).
- `location.types.ts`: GPS Coordinate, TelemetryPoint, ElevationSample.
- `user.types.ts`: UserProfile, AthleteSettings.
- `api.types.ts`: Pagination, NetworkResult, SyncStatus.

### K. `src/constants/` (Application Constants)

Static configuration values:

- `theme.ts`: Color palette, typography definitions, standard spacing tokens (`Spacing.four`).

### L. `src/tests/` (Testing Suite Architecture)

- **`unit/`**: Pure logic tests (utilities, mathematical calculations, reducers).
- **`integration/`**: Repository data flow tests, store action simulations.
- **`fixtures/`**: Mock GPX tracks, sample JSON workouts, mock user payloads.
- **`helpers/`**: Test render wrappers, mock database context, test timing utilities.

---

## 4. Practical Code-Location Guide

When building future capabilities, place code strictly according to these conventions:

| Capability                                     | Proper Code Location                                       |
| :--------------------------------------------- | :--------------------------------------------------------- |
| **GPS Sensor Listener**                        | `src/services/location.service.ts`                         |
| **Active Workout State (Timer/Coordinates)**   | `src/stores/recording.store.ts`                            |
| **Recording Screen & Pause/Resume UI**         | `src/features/recording/screens/RecordingScreen.tsx`       |
| **Workout Route Polyline Rendering**           | `src/features/maps/components/RouteMap.tsx`                |
| **Pace & Distance Mathematical Functions**     | `src/utilities/pace.ts` & `src/utilities/distance.ts`      |
| **Activity Database Storage (SQLite)**         | `src/repositories/activity.repository.ts`                  |
| **SQLite Table Migrations**                    | `src/database/migrations/001_create_activities.sql`        |
| **Instagram Activity Share Graphic Generator** | `src/features/sharing/components/ActivityCardSnapshot.tsx` |
| **Social Kudos Counter Component**             | `src/features/social/components/KudoButton.tsx`            |
| **Reusable App Primary Button**                | `src/components/ui/primary-button.tsx`                     |
| **Global Theme Tokens**                        | `src/constants/theme.ts`                                   |

---

## 5. Import Conventions

Always use the configured path alias `@/` instead of deep relative paths:

```typescript
// Recommended
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { formatPace } from '@/utilities/pace';

// Avoid
import { ThemedText } from '../../../components/ui/themed-text';
```
