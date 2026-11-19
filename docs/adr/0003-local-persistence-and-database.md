# ADR 0003: Local Persistence and Database Architecture

## 1. Title

ADR 0003 — Local Relational Persistence with Expo SQLite and Migration Management

## 2. Status

Accepted

## 3. Date

2026-11-19

## 4. Context and Problem

Fitness and outdoor tracking applications generate substantial structured telemetry:

- Workouts consisting of thousands of sequential GPS coordinates (latitude, longitude, altitude, timestamp, speed, heart rate).
- Activity summary statistics (total distance, elapsed duration, moving time, elevation gain, average pace, calories burned).
- Daily and weekly training aggregates (distance targets, streaks, personal records).
- Athlete preferences, equipment usage (running shoes, bicycles), and synchronization state flags.

Athletes frequently exercise in remote trails, mountain passes, and rural routes where cellular connectivity is intermittent or completely absent. The application cannot rely on network connections to persist workout telemetry. Furthermore, querying historical activities, calculating personal records, and rendering interactive route polylines requires high-performance, indexed, structured querying.

## 5. Decision

We select **Expo SQLite (`expo-sqlite`)** as the foundational local relational database engine for client-side storage.

### 5.1 Intended Database Responsibilities

- **Activity Records:** Storing finished workout metadata, athlete notes, sport type, and calculated splits.
- **GPS Telemetry Coordinates:** Sequential route points linked by foreign key to activity records, optimized with composite indices for rapid chronological retrieval.
- **Local Progress Aggregates:** Cached weekly and monthly training metrics to power instant dashboard rendering.
- **Sync Queue Metadata:** Tracking synchronization status (`pending`, `synced`, `failed`, `last_attempt_at`) for offline-first replication.

### 5.2 Architectural Principles

1. **Repository Abstraction:** Raw SQL statements and database handles must be encapsulated strictly within repositories (`src/repositories/`). UI components and domain hooks must never execute direct SQL queries.
2. **Sequential Versioned Migrations:** All database schema changes must be declared as deterministic, sequentially numbered SQL migration files under `src/database/migrations/` (e.g., `0001_initial_schema.sql`).
3. **Prepared Statements & Transactions:** Telemetry insertions during live recording and batch reads must use parameterized prepared statements and database transactions to ensure atomicity and prevent corruption.
4. **Separation of Sensitive Credentials:** SQLite is an unencrypted local database; security-sensitive credentials (such as auth refresh tokens or biometric keys) must be stored in `expo-secure-store`, not SQLite.
5. **No Direct Execution in Step 1.8:** Database initialization, table creation, and migrations remain scheduled for Phase 02.

## 6. Reasons for the Decision

- **Structured Relational Querying:** Efficiently handles complex queries (e.g., "fastest 5 km split across all 2026 trail runs") with sub-millisecond execution times via standard SQL indices.
- **High-Volume Telemetry Handling:** Can comfortably store tens of thousands of GPS coordinate points per activity without degrading JavaScript memory or serializing megabyte-sized JSON strings.
- **First-Party Expo SDK 58 Alignment:** `expo-sqlite` (v58.0.18) provides modern async native bindings (`openDatabaseAsync`, `runAsync`, `getAllAsync`) supporting high-throughput background writes.

## 7. Alternatives Considered

1. **AsyncStorage (`@react-native-async-storage/async-storage`):**
   - _Pros:_ Simple key-value string storage.
   - _Cons:_ Entire strings must be read into memory and parsed via `JSON.parse`. Completely unsuitable for querying historical activities or storing long arrays of coordinate points.
2. **SecureStore (`expo-secure-store`):**
   - _Pros:_ Hardware-backed keychain encryption.
   - _Cons:_ Strictly limited to small key-value items (< 2KB per entry). Intended for authentication tokens, not tabular fitness data.
3. **Remote-Only Persistence (Cloud Database):**
   - _Pros:_ No local database management.
   - _Cons:_ Catastrophic failure mode: workouts cannot be saved when offline, risking loss of athlete workout data.

## 8. Positive Consequences

- Robust offline recording resilience: workouts are guaranteed to persist locally even during app termination or system restart.
- Instant, non-blocking dashboard loading directly from local disk cache.
- Clear structural foundation for future cloud synchronization (Supabase).

## 9. Negative Consequences and Trade-offs

- Schema evolution requires disciplined migration management to prevent data corruption during client updates.
- Developers must write relational SQL schemas rather than loose JSON document structures.

## 10. Implementation Status

**Planned.**
`expo-sqlite` (`~58.0.18`) was installed in Step 1.5. Database initialization, schema definitions, and migration scripts are scheduled for implementation in Phase 02.

## 11. Future Validation or Follow-Up Decisions

- **Phase 02 — Step 2.1:** Implement database initialization harness and execute initial schema migration (`activities`, `telemetry_points`, `sync_queue`).
- **Phase 02 — Step 2.2:** Benchmark batch insert performance of 5,000 GPS points to verify zero UI frame drops during local saving.

## 12. Related Documentation or ADRs

- [docs/architecture/folder-structure.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/folder-structure.md)
- [ADR 0002 — Application Architecture and Data Flow](file:///D:/projects_mobile/step_counter/project/docs/adr/0002-application-architecture-and-data-flow.md)
- [ADR 0004 — Location and Background Activity Recording](file:///D:/projects_mobile/step_counter/project/docs/adr/0004-location-and-background-recording.md)
- [ADR 0007 — Offline-First Architecture and Synchronization](file:///D:/projects_mobile/step_counter/project/docs/adr/0007-offline-first-and-synchronization.md)
