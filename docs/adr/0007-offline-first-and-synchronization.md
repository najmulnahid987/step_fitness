# ADR 0007: Offline-First Architecture and Synchronization Lifecycle

## 1. Title

ADR 0007 — Offline-First Architecture, Resilient Sync Lifecycle and Cloud Boundary

## 2. Status

Accepted

## 3. Date

2026-11-19

## 4. Context and Problem

Athletes perform outdoor physical workouts across diverse environments: remote mountain trails, rural country roads, dense forests, and underground tunnels where cellular connectivity is frequently absent, degraded, or intermittent.

Traditional mobile applications built on an "online-first" model (where user actions immediately dispatch HTTP requests to a remote REST API) fail catastrophically in these conditions:

- Tapping "Save Workout" when offline either causes an indefinite loading spinner or drops the workout entirely.
- Loss of connectivity during multi-hour trail runs prevents opening previous workout summaries or inspecting progress.
- Poor network conditions cause battery drain due to constant network retry loops.

Conversely, social features (athlete feeds, kudos, segment leaderboards, follower lists) fundamentally require internet connectivity to communicate with remote athletes.

We need an architectural strategy that guarantees uninterrupted personal workout tracking while establishing a reliable, idempotent synchronization protocol when network connectivity is restored.

## 5. Decision

We establish an **Offline-First Data Architecture** for all personal fitness activities and a distinct **Cloud Boundary** for social interactions.

### 5.1 Offline-First Activity Lifecycle

```text
User Records Workout
        |
        v
Save Activity to Local SQLite (Immediate)
        |
        v
Update Local Dashboard & Personal Stats (Local)
        |
        v
Network Available & User Authenticated?
        |
    +---+---+
    |       |
   No      Yes
    |       |
    v       v
Retain   Enqueue in SQLite Sync Queue
Local       |
Data        v
         Dispatch Idempotent Sync Request (POST /activities)
            |
            +-------------------+
            |                   |
            v                   v
      Server Success      Server Error / Offline
            |                   |
            v                   v
      Mark as SYNCED      Mark as PENDING (Exponential Backoff)
```

### 5.2 Synchronization Principles

1. **Local Authoritative Write:** Every workout is written to the local SQLite database first. Local persistence is the immediate source of truth for the device.
2. **Client-Generated UUIDs:** All activities and route points are identified by client-generated UUIDv4 keys before transmission, preventing duplicate entity creation during network retries.
3. **Discrete Sync States:** Local records explicitly maintain a synchronization state column:
   - `local_only`: Athlete has not linked a cloud account; data remains purely local.
   - `pending`: Saved locally, queued for upload upon network connection.
   - `synced`: Successfully confirmed by the remote backend; remote timestamp recorded.
   - `failed`: Upload encountered a non-transient error (e.g., schema validation failure); flagged for diagnostic retry.
4. **Idempotent Operations:** Sync endpoints must be strictly idempotent. Resending an activity payload with an identical UUID must return HTTP 200 without creating duplicate records.
5. **Non-Destructive Failures:** A network failure or backend outage must never delete or corrupt the local workout record.
6. **Background Sync:** Synchronization attempts are executed via opportunistic background sync when network connectivity is re-established (via `NetInfo` listeners), with exponential backoff to conserve battery.

### 5.3 Social Feature Distinction & Cloud Boundary

A clear boundary is established between offline-capable personal tracking and cloud-dependent social networking:

| Capability                 |   Offline Support    |    Account Requirement    | Storage Location          |
| :------------------------- | :------------------: | :-----------------------: | :------------------------ |
| **GPS Workout Recording**  |   **Full (100%)**    | None (Guest mode allowed) | Local SQLite              |
| **Personal Stats & PRs**   |   **Full (100%)**    |           None            | Local SQLite              |
| **Historical Route Maps**  |  **Full (Cached)**   |           None            | Local SQLite & tile cache |
| **Social Activity Feed**   | Read Cached / Online | Cloud Account (Supabase)  | Remote Backend            |
| **Kudos & Comments**       |     Online Only      |       Cloud Account       | Remote Backend            |
| **Athlete Follower Graph** |     Online Only      |       Cloud Account       | Remote Backend            |
| **Multi-Device Sync**      |     Online Sync      |       Cloud Account       | Remote Backend            |

## 6. Reasons for the Decision

- **Zero Data Loss Guarantee:** Athletes never lose a workout because of network drops.
- **Instantaneous UI Responsiveness:** Saving, viewing, and analyzing workouts occurs with sub-millisecond local SQLite queries without waiting on remote server round-trips.
- **Lower Server Infrastructure Costs:** The backend processes bulk synchronization batches rather than maintaining open websockets or streaming individual coordinate points during workouts.

## 7. Alternatives Considered

1. **Online-First Architecture:**
   - _Pros:_ Simpler initial client code; no local SQLite sync queue.
   - _Cons:_ Disastrous for outdoor fitness apps: workouts fail to save in remote areas; battery drains rapidly from failed HTTP retries.
2. **Local-Only Application (No Cloud Sync):**
   - _Pros:_ Completely eliminates backend complexity and hosting costs.
   - _Cons:_ Prevents cross-device backup, phone upgrades, and social community features that drive long-term athlete engagement.

## 8. Positive Consequences

- The application remains 100% operational as a personal fitness tracker even in airplane mode.
- Clean separation between offline personal storage and online social networks.
- Predictable, testable synchronization state machine.

## 9. Negative Consequences and Trade-offs

- Synchronization queues, retry logic, and network state detection require dedicated implementation effort in Phase 03.
- Conflict resolution (e.g., editing an activity title on two devices simultaneously) requires "last-write-wins" or timestamp arbitration policies.

## 10. Implementation Status

**Planned.**
The architectural lifecycle and database scaffolding (`src/database/`) are in place. The sync queue schema, background sync workers, and remote Supabase endpoints are scheduled for Phase 03.

## 11. Future Validation or Follow-Up Decisions

- **Phase 03 — Step 3.4:** Design the `sync_queue` table schema and implement the synchronization state machine.
- **Phase 03 — Step 3.5:** Test airplane-mode recording, network reconnect, and idempotent retry recovery on physical devices.

## 12. Related Documentation or ADRs

- [docs/architecture/folder-structure.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/folder-structure.md)
- [ADR 0002 — Application Architecture and Data Flow](file:///D:/projects_mobile/step_counter/project/docs/adr/0002-application-architecture-and-data-flow.md)
- [ADR 0003 — Local Persistence and Database Architecture](file:///D:/projects_mobile/step_counter/project/docs/adr/0003-local-persistence-and-database.md)
- [ADR 0006 — Privacy, Permissions and Data Protection](file:///D:/projects_mobile/step_counter/project/docs/adr/0006-privacy-and-data-protection.md)
