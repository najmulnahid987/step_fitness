# ADR 0005: Maps Architecture and Provider Selection

## 1. Title

ADR 0005 — Provider-Independent Map Architecture and Deferred Map Vendor Selection

## 2. Status

Deferred

## 3. Date

2026-11-19

## 4. Context and Problem

Interactive cartography is an essential visual pillar for fitness and outdoor exploration:

- **Live Recording Map:** Real-time athlete position puck, heading indicator, and progressive route polyline tracing.
- **Activity Detail Route View:** Static/interactive map rendering historical GPS routes, elevation color gradients, start/finish milestone pins, and split markers.
- **Route Exploration:** Interactive panning across trails, local segment leaderboard highlights, and geographic route discovery.

However, mobile mapping technologies carry critical architectural implications:

- High operational recurring costs: Commercial map SDKs (Mapbox, Google Maps Platform) enforce pay-per-load or pay-per-monthly-active-user billing that can quickly become prohibitively expensive if not carefully controlled.
- Complex native build requirements: Map SDKs require native configuration plugins, API keys, platform frameworks (Metal on iOS, OpenGL/Vulkan on Android), and custom native bridges.
- Offline tile caching capabilities vary drastically between providers.

Prematurely coupling UI code directly to a proprietary SDK (such as embedding Mapbox-specific JSX tags throughout screens) risks severe vendor lock-in and expensive migration hurdles.

## 5. Decision

We make two architectural decisions:

### 5.1 Provider-Independent Map Architecture

All mapping interactions must be mediated through an **Application Map Interface** and **Provider Adapter** layer:

```text
Map Feature (src/features/maps/)
      |
      v
Application Map Interface (MapViewProps, PolylineProps, MarkerProps)
      |
      v
Map Provider Adapter (Adapter Component)
      |
      +---------------------+
      |                     |
      v                     v
Concrete Map SDK       Route Coordinate GeoJSON
(Mapbox / Google Maps / Apple Maps / MapLibre)
```

1. **Decoupled Props:** Feature screens consume a generic interface (`<AppMapView routeCoordinates={coords} />`).
2. **Adapter Isolation:** The adapter converts normalized coordinate arrays into the target SDK's specific coordinate primitives (e.g., GeoJSON FeatureCollections for Mapbox vs. `{ latitude, longitude }` objects for `react-native-maps`).
3. **Static Snapshots for Feeds:** Social feed workout cards will display lightweight cached static image snapshots (or map snapshot APIs) rather than rendering live interactive OpenGL/Metal viewports for every list item.

### 5.2 Vendor Selection Deferred

The selection of a concrete map provider is **strictly deferred** to the dedicated Map Integration phase (Phase 05). No map SDK, config plugin, or API key is introduced in Phase 01.

### 5.3 Candidate Evaluation Criteria for Phase 05

When evaluated in Phase 05, candidate providers will be scored against:

1. **Free Usage Allowance & Predictable Tier Pricing:** Monthly active user (MAU) thresholds and cost scaling.
2. **Expo SDK 58 Compatibility:** Verified support for modern React Native architecture (New Architecture / React 19).
3. **Cross-Platform Polyline Performance:** Rendering smooth 5,000+ point GPS routes with custom strokes.
4. **Offline Map Tile Caching:** Ability to store map tiles locally for trail running in areas without network reception.
5. **API Key & Configuration Ergonomics:** EAS build compatibility and secret key management.

## 6. Reasons for the Decision

- **Cost Protection:** Prevents premature lock-in to an expensive commercial plan before athlete volume is known.
- **Architectural Flexibility:** Allows swapping the underlying cartography provider (e.g., migrating from Google Maps to MapLibre) without modifying a single line of feature or screen UI code.
- **Zero Native Overhead in Phase 01:** Avoids adding native map binaries or heavy build dependencies while the foundational navigation and data layers are stabilized.

## 7. Alternatives Considered (Candidate Evaluation in Phase 05)

1. **Mapbox Maps SDK (`@rnmapbox/maps`):**
   - _Considerations:_ Industry-standard vector rendering, customizable outdoor terrain styles, excellent polyline performance; requires commercial account with credit card and monthly active user billing.
2. **React Native Maps (`react-native-maps` with Apple Maps & Google Maps):**
   - _Considerations:_ Leverages free native Apple Maps on iOS; on Android, requires Google Cloud billing and API key setup.
3. **Expo Maps (`expo-maps`):**
   - _Considerations:_ First-party Expo module; undergoing rapid iterative evolution across recent SDKs; requires evaluation of SDK 58 stability and polyline capabilities.
4. **MapLibre Native (`@maplibre/maplibre-react-native`):**
   - _Considerations:_ Open-source fork of Mapbox; zero vendor licensing fees when self-hosting vector tiles (e.g., OpenStreetMap / Protomaps); requires managing tile infrastructure.

## 8. Positive Consequences

- Zero map billing or API key overhead in early development.
- UI components remain pure and independent of vendor-specific quirks.
- Clean isolation of cartography logic in `src/features/maps/`.

## 9. Negative Consequences and Trade-offs

- Interactive map exploration is unavailable during Phase 01 (Explore tab displays placeholder cards).
- Constructing a generic map adapter requires additional interface definition work during Phase 05.

## 10. Implementation Status

**Deferred.**
No map dependencies, plugins, or credentials exist in the project. Full adapter construction and vendor selection will be executed in Phase 05.

## 11. Future Validation or Follow-Up Decisions

- **Phase 05 — Step 5.1:** Conduct live performance and pricing audit of top 2 candidates on physical Android and iOS devices.
- **Phase 05 — Step 5.2:** Implement `src/features/maps/adapters/` and document selection in ADR 0005 Addendum.

## 12. Related Documentation or ADRs

- [docs/architecture/folder-structure.md](file:///D:/projects_mobile/step_counter/project/docs/architecture/folder-structure.md)
- [ADR 0002 — Application Architecture and Data Flow](file:///D:/projects_mobile/step_counter/project/docs/adr/0002-application-architecture-and-data-flow.md)
- [ADR 0004 — Location and Background Activity Recording](file:///D:/projects_mobile/step_counter/project/docs/adr/0004-location-and-background-recording.md)
