# ADR 0001: Navigation and Routing Architecture

## 1. Title

ADR 0001 — Navigation and Routing Architecture with Expo Router NativeTabs

## 2. Status

Accepted

## 3. Date

2026-11-19

## 4. Context and Problem

A Strava-inspired outdoor fitness tracking application requires an intuitive, mobile-first navigation hierarchy. The application must support:

- Primary top-level navigation between core functional domains (social activity feed, route discovery, live workout recording, athlete progress metrics, and profile/settings).
- Modally isolated authentication flows (sign-in, account creation, password reset).
- Dynamic deep routing for individual activity workout summaries (`/activity/:id`).
- Catch-all 404 error handling for unmatched routes.
- Deep linking capabilities from push notifications and OAuth authentication callbacks via custom URL schemes.
- Strict compile-time route type safety without brittle string-literal paths.

Traditional React Navigation manually maintains separate navigation container configurations, screen registries, and imperative linking dictionaries. This approach often results in synchronization drift between route declarations, deep linking paths, and TypeScript parameter lists.

## 5. Decision

We adopt **Expo Router** (SDK 58) as the foundational navigation framework using the stable `expo-router/native-tabs` API for the main application shell:

1. **File-Based Routing:** Routes map deterministically to files within `src/app/`. Layout scaffolds are declared using `_layout.tsx` files.
2. **Native Bottom Tab Shell (`src/app/(tabs)/`):** Implemented using `NativeTabs` with exactly five tabs:
   - **Feed (`/(tabs)/feed`):** Community activities, kudos, and social timeline.
   - **Explore (`/(tabs)/explore`):** Trail search, route discovery, segments, and map browsing.
   - **Record (`/(tabs)/record`):** Dedicated GPS workout recording launcher.
   - **Progress (`/(tabs)/progress`):** Athlete statistics, weekly mileage charts, personal records (PRs).
   - **Profile (`/(tabs)/profile`):** Athlete biography, gear tracker, lifetime stats, and account settings.
3. **Authentication Group (`src/app/(auth)/`):** Isolated stack navigator (`sign-in.tsx`, `sign-up.tsx`, `forgot-password.tsx`) partitioned from the root tab bar.
4. **Dynamic Activity Routes (`src/app/activity/[id].tsx`):** Parameterized stack screen reading IDs via `useLocalSearchParams<{ id: string }>()`.
5. **URL Scheme & Deep Linking:** Configured under `scheme: "fitnessactivity"` in `app.json`, supporting URLs such as `fitnessactivity://activity/123`.
6. **Typed Routes:** Enabled via `experiments.typedRoutes: true` in `app.json`, generating type-safe route definitions in `.expo/types/router.d.ts`.

## 6. Reasons for the Decision

- **Platform-Native Feel:** `expo-router/native-tabs` renders native iOS `UITabBar` and Android Bottom Navigation bars rather than JavaScript-simulated tabs, ensuring native fluid transitions, accessibility roles, and platform styling (SF Symbols on iOS, Material icons on Android).
- **Unified Deep Linking:** Routing and deep linking are automatically synchronized based on filesystem structure without maintaining complex regex linking trees.
- **Maintainability:** Adding a screen simply requires placing a file in the appropriate directory.
- **Strict Type Safety:** Autocomplete and compile-time type validation for `router.push('/activity/101')` prevents broken navigation links.

## 7. Alternatives Considered

1. **Manual React Navigation Configuration:**
   - _Pros:_ Complete low-level imperative control over every navigator instance.
   - _Cons:_ Requires duplicate route maps, manually maintained linking configurations, and boilerplate type definitions prone to runtime drift.
2. **JavaScript-based Tabs (`@react-navigation/bottom-tabs`):**
   - _Pros:_ Highly customizable styling in JS.
   - _Cons:_ Lacks native platform gesture responsiveness and SF Symbol integration provided by SDK 58 `NativeTabs`.

## 8. Positive Consequences

- Deterministic route structure visible directly from file organization.
- Instant deep-linking support for push notifications and external authentication redirects.
- Zero boilerplate navigation wiring across screens.
- Clean separation between modal auth routes and core tab navigation.

## 9. Negative Consequences and Trade-offs

- Files placed inside `src/app/` are automatically treated as routes; helper components and hooks must strictly reside outside `src/app/`.
- Native tabs are constrained by native platform guidelines (e.g., standard 5-tab maximum on Android).
- Native tab customization is bounded by native platform styling APIs rather than arbitrary CSS flex layouts.

## 10. Implementation Status

**Implemented.**
The five-tab shell (`src/app/(tabs)/`), auth group (`src/app/(auth)/`), dynamic activity route (`src/app/activity/[id].tsx`), root layout (`src/app/_layout.tsx`), and redirect (`src/app/index.tsx`) are fully operational and verified under SDK 58.

## 11. Future Validation or Follow-Up Decisions

- **Phase 03:** Introduce route protection middleware/guarding to redirect unauthenticated athletes to `/(auth)/sign-in` when attempting to access social or cloud features.
- **Phase 04:** Implement modal presentation for active workout recording (`src/app/record/live.tsx`) with full-screen dismiss prevention during active tracking.

## 12. Related Documentation or ADRs

- [docs/architecture/folder-structure.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/folder-structure.md)
- [docs/architecture/app-configuration.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/app-configuration.md)
- [ADR 0002 — Application Architecture and Data Flow](file:///D:/projects_mobile/step_counter/project/docs/adr/0002-application-architecture-and-data-flow.md)
