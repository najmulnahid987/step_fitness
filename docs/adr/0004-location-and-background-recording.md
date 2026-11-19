# ADR 0004: Location and Background Activity Recording

## 1. Title

ADR 0004 — Location Architecture, Background Task Execution & Recording Reliability

## 2. Status

Accepted

## 3. Date

2026-11-19

## 4. Context and Problem

Accurate outdoor fitness tracking is the central capability of a Strava-inspired application. Outdoor activities (runs, bike rides, hikes) present rigorous device execution challenges:

- Workouts typically last from 30 minutes to multiple hours.
- Athletes routinely lock their mobile displays or switch between applications (e.g., streaming music, answering phone calls, viewing photography).
- Modern mobile operating systems (iOS and Android) aggressively enforce battery management, suspending or terminating background processes that do not comply with strict location services criteria.
- GPS signals are subject to atmospheric distortion, urban canyon reflection, tunnel signal loss, and hardware jitter.
- Premature or aggressive location permission prompts (e.g., asking for "Always Allow" location during initial onboarding) degrade user trust and result in permission denials.

We need an architectural blueprint that balances location accuracy, background recording continuity, battery conservation, and athlete privacy.

## 5. Decision

We establish a two-tier location architecture leveraging **Expo Location (`expo-location`)** and **Expo TaskManager (`expo-task-manager`)**:

### 5.1 Foreground Location Acquisition

- **Contextual Request:** Location permissions (`requestForegroundPermissionsAsync`) are requested strictly in-context when the athlete taps "Record Workout", never during application launch or onboarding.
- **Active UI Telemetry:** While the application is active in the foreground, `Location.watchPositionAsync` provides continuous coordinates for the live map and real-time pace/distance gauges.

### 5.2 Background Location Recording

- **Headless Task Definition:** A headless background location task is registered at **module scope** (outside React component trees) via `TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => ...)` in accordance with Expo requirements.
- **Explicit User Awareness:** Background location is requested (`requestBackgroundPermissionsAsync`) only after the user initiates an outdoor recording session and has granted foreground permission.
- **Android Foreground Service:** When background recording is active on Android, a persistent, non-dismissible notification (`LocationForegroundService`) must display live duration, distance, and a quick "Pause/Stop" action.

### 5.3 Recording State & Telemetry Reliability

1. **Separation of State:** The recording engine and state machine operate independently of React UI components. Component unmounts or navigation switches must not interrupt recording.
2. **Local Coordinate Buffering:** Coordinate updates received from TaskManager are immediately buffered to local persistence (SQLite) in small batches to prevent data loss in the event of OS process termination.
3. **Jitter & Duplicate Filtering:** Incoming coordinates are filtered based on horizontal accuracy thresholds (e.g., discarding points with accuracy > 25 meters) and time deltas (suppressing duplicate timestamps).
4. **GPS Drop Resilience:** If satellite lock is lost (e.g., passing through a tunnel), elapsed time continues, the state machine logs a signal warning, and distance calculations pause until valid accuracy resumes.

## 6. Reasons for the Decision

- **Continuity:** Athletes expect an uninterrupted workout recording even if they lock their phone or take a photo.
- **First-Party Compatibility:** `expo-location` and `expo-task-manager` provide standardized native bridge contracts supported across both iOS CoreLocation and Android Google Play Location Services.
- **Privacy Compliance:** In-context permission requests maximize authorization rates while respecting user privacy boundaries.

## 7. Alternatives Considered

1. **Foreground-Only Location Tracking:**
   - _Pros:_ Simpler implementation, avoids background permission complexities.
   - _Cons:_ Complete product failure: turning off the screen or switching to a music app terminates recording, resulting in lost workout routes.
2. **Custom Native Location Modules (Bare React Native Bridge):**
   - _Pros:_ Ultimate control over low-level platform APIs.
   - _Cons:_ Breaks Continuous Native Generation (CNG), introduces high maintenance overhead, and bypasses Expo SDK 58 stability.

## 8. Positive Consequences

- Athletes can safely pocket their phones with locked screens while recording multi-hour workouts.
- Resilient local buffering prevents data loss during sudden battery exhaustion or operating system memory purges.
- High privacy transparency with clear user-facing purpose descriptions.

## 9. Negative Consequences and Trade-offs

- Background location consumes measurable battery power; continuous tuning of distance intervals and accuracy modes is required.
- **Expo Go Limitation:** Background location cannot be verified reliably inside standard Expo Go. Physical device verification requires an EAS Development Build (`npx expo run:android` / `npx expo run:ios`).
- Apple App Store review requires detailed justification and video demonstration of background location usage.

## 10. Implementation Status

**Planned.**
Dependencies `expo-location` (`~58.0.22`) and `expo-task-manager` (`~58.0.14`) were installed in Step 1.5, and iOS usage descriptions were declared in `app.json`. Active position watching, background task registration, and foreground notification services remain scheduled for Phase 04.

## 11. Future Validation or Follow-Up Decisions

- **Phase 04 — Step 4.1:** Author the headless background task handler in `src/features/recording/services/location-task.ts`.
- **Phase 04 — Step 4.2:** Execute field verification on a physical device using an EAS Development Build with screen locked for 15+ minutes.

## 12. Related Documentation or ADRs

- [docs/architecture/app-configuration.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/app-configuration.md)
- [ADR 0002 — Application Architecture and Data Flow](file:///D:/projects_mobile/step_counter/project/docs/adr/0002-application-architecture-and-data-flow.md)
- [ADR 0003 — Local Persistence and Database Architecture](file:///D:/projects_mobile/step_counter/project/docs/adr/0003-local-persistence-and-database.md)
- [ADR 0006 — Privacy, Permissions and Data Protection](file:///D:/projects_mobile/step_counter/project/docs/adr/0006-privacy-and-data-protection.md)
