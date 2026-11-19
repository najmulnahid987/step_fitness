# ADR 0002: Application Architecture and Data Flow

## 1. Title

ADR 0002 — Feature-Based Layered Architecture and Unidirectional Data Flow

## 2. Status

Accepted

## 3. Date

2026-11-19

## 4. Context and Problem

As a fitness tracking application grows, codebases commonly degenerate into monolithic component directories, sprawling utility folders, and tangled dependencies where UI components directly execute SQL queries, handle hardware GPS events, or dispatch external network calls.

The Fitness Activity application must scale across multiple distinct functional domains:

- Workout Recording (GPS location watching, timer state machine, sensor filtering)
- Interactive Mapping (polyline rendering, camera framing, map tiles)
- Activity Analytics (telemetry calculations, elevation gain, split paces)
- Social Feeds & Athlete Profiles (kudos, comments, follower lists)
- Local Persistence & Offline Sync (relational caching, sync queues)

We need an architectural structure that enforces high domain cohesion, loose coupling, testability, and clear separation of concerns without introducing excessive, premature abstraction layers.

## 5. Decision

We establish a **feature-first modular architecture** paired with a **unidirectional layered data flow**.

### 5.1 Layered Data Flow Model

```text
Screen / Route (src/app/)
      |
      v
Feature UI Components (src/features/*/components/)
      |
      v
Feature Hooks & Domain Logic (src/features/*/hooks/)
      |
      v
Application Services (src/services/)
      |
      v
Repositories (src/repositories/)
      |
      +--------------------+
      |                    |
      v                    v
Local Data Sources    Remote Data Sources
      |                    |
      v                    v
SQLite Database       Backend Services (Supabase)
```

### 5.2 Layer Responsibilities

1. **Routes (`src/app/`):**
   - Thin entry points managed by Expo Router.
   - Responsible only for mounting feature screens, parsing URL query parameters, and configuring navigation headers.
   - Strictly contains zero business logic, raw SQL, or direct API calls.
2. **Features (`src/features/<domain>/`):**
   - Autonomous vertical domain slices (e.g., `recording`, `activities`, `feed`, `explore`, `profile`).
   - Encapsulates domain-specific screens, components, hooks, services, and types.
   - Cross-feature dependencies must be explicit and mediated through shared contracts.
3. **Shared Components (`src/components/ui/`):**
   - Pure, reusable design system primitives (`AppButton`, `AppCard`, `AppText`, `AppTextInput`, `MetricCard`).
   - Must remain agnostic of specific feature domains and never import from `src/features/`.
4. **Application Services (`src/services/`):**
   - Hardware, operating system, and third-party integrations (e.g., `LocationService`, `NotificationService`, `MediaService`).
   - Encapsulates native platform APIs behind testable interfaces.
5. **Repositories (`src/repositories/`):**
   - Abstraction boundary between business logic and underlying storage engines.
   - Mediates between the local SQLite database and remote backend APIs.
6. **Database (`src/database/`):**
   - Manages local SQLite database initialization, table schemas, and sequential migrations.
7. **State Stores (`src/stores/`):**
   - Dedicated exclusively to cross-cutting application state that cannot be cleanly scoped to component subtrees (e.g., active GPS recording state machine, auth session).
   - **Constraint:** We prefer React component state, custom hooks, and React Context. Global state libraries (such as Zustand) are deferred until cross-screen complexity strictly requires them.

## 6. Reasons for the Decision

- **High Cohesion:** All files relating to a single functional domain (e.g., GPS recording) are located together, allowing developers to modify features without jumping across distant directories.
- **Testability:** Decoupling repositories and services from UI components enables unit testing with lightweight mock data sources without mounting native views.
- **Maintainable Team Scaling:** Multiple engineers can work concurrently on separate features (e.g., social feed vs. GPS tracker) with minimal Git merge conflicts.

## 7. Alternatives Considered

1. **Flat / Traditional Group-by-Type Architecture (`components/`, `screens/`, `hooks/`):**
   - _Pros:_ Simple at project inception.
   - _Cons:_ Rapidly degrades into chaotic 50+ file folders where finding related code is slow and circular imports proliferate.
2. **Pure Hexagonal / Clean Architecture (Enterprise):**
   - _Pros:_ Complete decoupling through strict interfaces and dependency inversion.
   - _Cons:_ Heavy boilerplate (use-cases, interactors, mappers, entities) that introduces excessive friction for a mobile startup product.
3. **Global State First (Overuse of Redux/Zustand):**
   - _Pros:_ All data stored in a single central store.
   - _Cons:_ Turns local UI states into global cache management nightmares, increases bundle size, and harms rendering performance.

## 8. Positive Consequences

- Predictable code discovery: developers know exactly where to locate domain logic.
- Clear boundaries prevent UI screens from coupling directly to database drivers or native SDKs.
- Clear migration path to integrate SQLite and Supabase in subsequent phases.

## 9. Negative Consequences and Trade-offs

- Requires discipline to prevent shared UI components from importing feature modules.
- Slightly higher initial file count due to domain scaffolding (`.gitkeep` markers).

## 10. Implementation Status

**Partially implemented.**
The source directory structure (`src/features/`, `src/services/`, `src/repositories/`, `src/database/`, `src/components/ui/`) is established. Domain hooks, repositories, and services will be implemented incrementally in subsequent functional phases.

## 11. Future Validation or Follow-Up Decisions

- **Phase 02:** Implement SQLite repositories (`ActivityRepository`, `TelemetryRepository`) following this data flow.
- **Phase 04:** Evaluate whether the live recording state machine requires a Zustand store or can be encapsulated within a React Context provider.

## 12. Related Documentation or ADRs

- [docs/architecture/folder-structure.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/folder-structure.md)
- [ADR 0001 — Navigation and Routing Architecture](file:///D:/projects_mobile/step_counter/project/docs/adr/0001-navigation-and-routing.md)
- [ADR 0003 — Local Persistence and Database Architecture](file:///D:/projects_mobile/step_counter/project/docs/adr/0003-local-persistence-and-database.md)
- [ADR 0007 — Offline-First Architecture and Synchronization](file:///D:/projects_mobile/step_counter/project/docs/adr/0007-offline-first-and-synchronization.md)
