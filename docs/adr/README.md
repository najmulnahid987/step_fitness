# Architecture Decision Records (ADRs)

**Project:** Fitness Activity — Strava-Inspired Fitness & Outdoor Activity Application  
**Directory:** `docs/adr/`  
**Standard:** Michael Nygard ADR Template Format

---

## 1. What is an Architecture Decision Record (ADR)?

An Architecture Decision Record (ADR) is a lightweight document that captures an important architectural decision made on a software project, along with its context, rationale, consequences, and trade-offs.

By maintaining ADRs in version control alongside the code:

- New engineers can quickly understand _why_ the system is designed the way it is.
- Inconsistent or contradictory technical decisions are prevented.
- Technical debt and architectural trade-offs are explicitly recorded rather than hidden.

---

## 2. Numbering Convention

ADRs are sequentially numbered using a 4-digit zero-padded integer prefix followed by a hyphenated lowercase title:
`XXXX-kebab-case-title.md`

Example: `0001-navigation-and-routing.md`

---

## 3. Status Definitions

Every ADR maintains an authoritative decision status and an implementation status:

### Decision Statuses

- **Accepted:** The decision has been formally evaluated, approved, and integrated into the active architecture.
- **Proposed:** A preferred architectural direction has been documented but requires further technical evaluation or stakeholder sign-off.
- **Deferred:** The decision cannot responsibly be finalized until additional prerequisites, physical device testing, or vendor evaluations are completed.
- **Superseded:** A subsequent ADR has replaced or modified this decision (with an explicit reference link to the new ADR).

### Implementation Statuses

- **Implemented:** The decision is fully built, tested, and operational in the current codebase.
- **Partially implemented:** Foundational scaffolding, configs, or types exist, but full functional implementation spans future phases.
- **Planned:** The architectural direction is approved and scheduled for execution in an upcoming development phase.
- **Deferred:** Implementation is intentionally postponed until vendor or platform prerequisites are verified.

---

## 4. ADR Summary Index

|                             ADR                              | Title                                                                                                 | Decision Status |   Implementation Status   | Core Technology / Scope                                                 |
| :----------------------------------------------------------: | :---------------------------------------------------------------------------------------------------- | :-------------: | :-----------------------: | :---------------------------------------------------------------------- |
|          **[0001](0001-navigation-and-routing.md)**          | [Navigation and Routing Architecture](0001-navigation-and-routing.md)                                 |  **Accepted**   |      **Implemented**      | Expo Router NativeTabs, Typed Routes, Deep Linking                      |
|  **[0002](0002-application-architecture-and-data-flow.md)**  | [Application Architecture and Data Flow](0002-application-architecture-and-data-flow.md)              |  **Accepted**   | **Partially implemented** | Feature-First Modular Structure, Repositories, Services                 |
|      **[0003](0003-local-persistence-and-database.md)**      | [Local Persistence and Database Architecture](0003-local-persistence-and-database.md)                 |  **Accepted**   |        **Planned**        | Expo SQLite (`expo-sqlite`), Relational Caching, Migrations             |
|    **[0004](0004-location-and-background-recording.md)**     | [Location and Background Activity Recording](0004-location-and-background-recording.md)               |  **Accepted**   |        **Planned**        | Expo Location & TaskManager, In-Context Permissions, Foreground Service |
| **[0005](0005-maps-architecture-and-provider-selection.md)** | [Maps Architecture and Provider Selection](0005-maps-architecture-and-provider-selection.md)          |  **Deferred**   |       **Deferred**        | Decoupled Map Adapter, Vendor Selection Postponed to Phase 05           |
|       **[0006](0006-privacy-and-data-protection.md)**        | [Privacy, Permissions and Data Protection Architecture](0006-privacy-and-data-protection.md)          |  **Accepted**   | **Partially implemented** | Privacy Zones, In-Context Permissions, Row Level Security (RLS)         |
|    **[0007](0007-offline-first-and-synchronization.md)**     | [Offline-First Architecture and Synchronization Lifecycle](0007-offline-first-and-synchronization.md) |  **Accepted**   |        **Planned**        | Offline-First SQLite Writes, Idempotent Sync Queue, Cloud Boundary      |

---

## 5. Architectural Invariants Across All Records

1. **Client Security:** Private backend service-role keys and administrative credentials must never be included in the mobile client or `EXPO_PUBLIC_*` variables.
2. **Local-First Autonomy:** Personal workout tracking and workout history must operate 100% offline without requiring account registration.
3. **No Vendor Lock-In:** Hardware and external cloud services (mapping, backend, location) must be mediated by abstract interfaces and repository patterns.
4. **Minimal Dependencies:** New libraries are added only when platform native modules strictly require them, preserving minimal bundle size and maintainability.
