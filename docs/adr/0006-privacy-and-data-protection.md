# ADR 0006: Privacy, Permissions and Data Protection Architecture

## 1. Title

ADR 0006 — Location Privacy, Data Minimization and Client-Side Security Architecture

## 2. Status

Accepted

## 3. Date

2026-11-19

## 4. Context and Problem

Outdoor fitness applications collect exceptionally sensitive personal data:

- High-precision continuous GPS telemetry revealing exact residential addresses, daily routines, workplaces, and frequent running routes.
- Biometric and health metrics (heart rate, cadence, training volume, body weight).
- Athlete social networks, activity photos, and location-tagged stories.

In the fitness industry, careless data exposure has historically led to severe real-world security vulnerabilities (e.g., public heatmaps revealing confidential facilities, stalkers discovering residential origins from route starting points).

Additionally, modern mobile clients execute in untrusted environments where compiled application bundles can be decompiled to extract hardcoded secrets or bypass client-side checks.

## 5. Decision

We establish comprehensive security and privacy invariants across the application lifecycle:

### 5.1 Location Privacy & Privacy Zones

1. **Explicit Sharing Opt-In:** All recorded workouts default to **Private** (visible only to the author). Public sharing or visibility to followers requires explicit athlete authorization.
2. **Start / End Privacy Zones (Future Phase 03/04):** The application will support user-defined privacy zones (e.g., 500-meter radius around home/office) where route lines are automatically hidden or clipped on shared maps.
3. **No Unprompted Tracking:** Location sensors are never queried when the user is not actively recording an activity.

### 5.2 Contextual Permission Model

- **Zero Onboarding Prompts:** The application never requests location, media, or notification permissions during initial startup or onboarding.
- **In-Context Justification:** Permissions are requested only at the exact point of need (e.g., requesting location only when the user taps "Start Workout").
- **Graceful Degradation:** If location permissions are denied, the application clearly explains the limitation, allows manual workout entry (e.g., treadmill runs), and provides deep-links to system settings.

### 5.3 Local-First Personal Data Storage

- Personal activities, workout history, and personal records reside on the device in local SQLite storage.
- An athlete can track and view personal workouts locally without an account or cloud connection.

### 5.4 Environment Secrets & Mobile Boundary

- **Public Keys Only:** Client code may only contain public identifiers (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- **Forbidden in Mobile Bundle:** Supabase `service_role` keys, backend admin credentials, database connection strings, and private provider signing secrets are strictly forbidden.
- **Git Protection:** `.gitignore` enforces exclusion of `.env` and all `.env.*` variants while preserving `.env.example`.

### 5.5 Backend Access Control via Row Level Security (RLS)

- Client-side validation is treated strictly as a user-experience enhancement, never as a security boundary.
- All authorization, data segregation, and activity access controls must be enforced directly on the database engine using PostgreSQL Row Level Security (RLS) policies in Supabase (Phase 03).

### 5.6 User Data Sovereignty

- Athletes must have the capability to export all recorded GPS routes (GPX/FIT format) and permanently delete their local data and remote account.

## 6. Reasons for the Decision

- **Athlete Safety:** Hiding sensitive start/end points protects users from harassment and physical tracking.
- **Regulatory Compliance:** Adheres to GDPR, CCPA, and Apple App Store privacy mandates regarding user consent and data minimization.
- **Zero Secret Exposure:** Eliminates the risk of catastrophic database compromise via decompiled mobile packages.

## 7. Alternatives Considered

1. **Mass Permissions at Onboarding:**
   - _Pros:_ Simpler to request everything upfront.
   - _Cons:_ High abandonment rates; violates platform guidelines; creates user distrust.
2. **Cloud-Only Centralized Database:**
   - _Pros:_ No local data storage management.
   - _Cons:_ Breaches privacy when user does not want their routes sent to remote servers; impossible to track offline.
3. **Client-Side Security Filtering:**
   - _Pros:_ Easier to implement filters in React Native code.
   - _Cons:_ Insecure; anyone can intercept network requests and view unredacted data if the backend does not enforce RLS.

## 8. Positive Consequences

- Athletes maintain complete confidence in their personal location privacy.
- Robust protection against automated key scrapers and bundle deconstruction.
- Personal tracking operates independently of cloud account creation.

## 9. Negative Consequences and Trade-offs

- Implementing start/end coordinate clipping algorithms requires additional geometric processing in the activity service layer.
- Enforcing strict RLS policies requires careful SQL policy design and testing during backend integration.

## 10. Implementation Status

**Partially implemented.**
Environment variable security and runtime Zod sanitization ([src/config/env.ts](file:///D:/projects_mobile/step_counter/project/src/config/env.ts)) are implemented. Location privacy zones, privacy settings toggles, and Supabase RLS policies are scheduled for Phase 03 and Phase 04.

## 11. Future Validation or Follow-Up Decisions

- **Phase 03 — Step 3.2:** Define and verify PostgreSQL Row Level Security (RLS) policies for activities and profiles.
- **Phase 04 — Step 4.4:** Implement geographic clipping algorithms for privacy zones.

## 12. Related Documentation or ADRs

- [docs/architecture/app-configuration.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/app-configuration.md)
- [ADR 0004 — Location and Background Activity Recording](file:///D:/projects_mobile/step_counter/project/docs/adr/0004-location-and-background-recording.md)
- [ADR 0007 — Offline-First Architecture and Synchronization](file:///D:/projects_mobile/step_counter/project/docs/adr/0007-offline-first-and-synchronization.md)
