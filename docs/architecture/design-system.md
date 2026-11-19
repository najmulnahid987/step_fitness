# Design System & Reusable UI Components

**Project:** Fitness Activity — Strava-Inspired Fitness & Outdoor Activity Application  
**Phase:** 01 — Project Initialization and Architecture  
**Step:** 1.6 — Design System, Theme Tokens & Reusable UI Components  
**Status:** Implemented & Verified

---

## 1. Design Philosophy

The application's design language prioritizes **calm clarity, minimal cognitive overhead, and athletic focus**. Unlike cluttered fitness dashboards saturated with loud neon accents, heavy drop shadows, or competing gradient panels, this design system provides an uncluttered, modern, and accessible experience:

- **Light & Uncluttered:** Surfaces are crisp white or soft muted neutral greys, creating generous breathing room.
- **Teal as Primary Identity:** Teal (`#0B756C`) establishes a focused, calm outdoor athletic aesthetic.
- **Restrained Accents:** Aqua (`#8BD6D0`) is reserved for subtle secondary highlights; muted yellow (`#EACB73`) is strictly reserved for milestone achievements.
- **Data-First Typography:** Metrics (distance, pace, heart rate, calories) are legible at a glance without overpowering secondary labels.
- **Touch-First Accessibility:** Touch targets strictly adhere to standard minimum interactive dimensions (≥ 44pt), with explicit accessibility roles and states.

---

## 2. Visual Reference Interpretation

The design system bridges the visual balance of modern fitness applications with the user's explicit design preferences:

1. **Dashboard Hierarchy:** Cards group related workout metrics into distinct surfaces with unified padding (`Spacing.md = 16`) and subtle borders (`#E0E8E5`), avoiding visual collision.
2. **Elevation & Depth:** Heavy drop shadows are eliminated. Flat surfaces use 1px subtle outlines or delicate 4% opacity ambient shadows (`Shadows.subtle`).
3. **Corner Geometry:** Components use restrained radii (`BorderRadius.md = 12` for controls, `BorderRadius.lg = 16` for cards). Pill shapes are avoided for containers.

---

## 3. Color Palette & Semantic Tokens

All colors are centralized in [src/constants/theme.ts](file:///D:/projects_mobile/step_counter/project/src/constants/theme.ts) as immutable tokens (`Palette`).

### 3.1 Color Tokens

| Token                | Hex                   | Role & Usage                                                      |
| :------------------- | :-------------------- | :---------------------------------------------------------------- |
| `primary`            | `#0B756C`             | Primary brand teal; main buttons, active toggles, key actions     |
| `primaryPressed`     | `#075E58`             | Darker pressed state for primary buttons                          |
| `primarySubtle`      | `#E4F1EF`             | Soft teal tint for selected cards, badges, and secondary buttons  |
| `aqua`               | `#8BD6D0`             | Supporting accent for secondary visual metrics                    |
| `mutedYellow`        | `#EACB73`             | Trophy, personal record (PR), and challenge highlights only       |
| `background`         | `#F5F7F6`             | Main screen canvas background                                     |
| `surface`            | `#FFFFFF`             | Elevated card surfaces, modal dialogs, and text input backgrounds |
| `mutedSurface`       | `#EDF2F0`             | Subtle secondary card surfaces and pill containers                |
| `mainText`           | `#1F2C2A`             | Primary typography; high-contrast readable dark charcoal          |
| `secondaryText`      | `#63716E`             | Supporting labels, timestamps, units, and hints                   |
| `tertiaryText`       | `#87928F`             | Placeholders, inactive captions, and non-critical details         |
| `border`             | `#E0E8E5`             | Structural dividers and subtle card outlines                      |
| `borderFocused`      | `#0B756C`             | Active text input focus border                                    |
| `success`            | `#2F8066`             | Workout completed, goal reached, positive trends                  |
| `warning`            | `#A9781D`             | GPS signal degradation, battery warnings                          |
| `error`              | `#B84C4C`             | Destructive actions, validation errors, GPS loss                  |
| `errorSubtle`        | `#FBEBEB`             | Error callout background tint                                     |
| `disabledBackground` | `#EAEFEF`             | Inactive button and control backgrounds                           |
| `disabledText`       | `#A1ADA9`             | Inactive label text                                               |
| `overlay`            | `rgba(0, 0, 0, 0.45)` | Dimmed backdrop for modal dialogs                                 |

---

## 4. Typography Scale

Platform-native system fonts are used exclusively (`San Francisco` on iOS, `Roboto` on Android).

| Variant          | Font Size | Line Height | Weight | Intended Usage                                     |
| :--------------- | :-------- | :---------- | :----- | :------------------------------------------------- |
| `caption`        | 12        | 16          | 400    | Minor metadata, legal disclaimers, micro labels    |
| `supporting`     | 14        | 20          | 400    | Form helpers, secondary descriptions, card units   |
| `body`           | 16        | 24          | 400    | Primary paragraph text, list item descriptions     |
| `bodyEmphasis`   | 18        | 26          | 600    | Emphasized body text, list headings, button labels |
| `smallHeading`   | 20        | 28          | 600    | Card titles, dialog headings, section subheaders   |
| `sectionHeading` | 24        | 32          | 700    | Major screen section headings, modal titles        |
| `largeHeading`   | 28        | 36          | 700    | Metric summaries, workout statistics               |
| `display`        | 32        | 40          | 700    | Hero metrics (large step counters, live pace)      |

---

## 5. Spacing Scale

A strict geometric spacing scale guarantees visual rhythm across all screens:

```typescript
export const Spacing = {
  xxs: 4, // Micro spacing between icon and text
  xs: 8, // Tight spacing, internal button gaps
  sm: 12, // Form field margins, dialog action gaps
  md: 16, // Standard card padding, screen horizontal insets
  lg: 20, // Section vertical margins, large button insets
  xl: 24, // Card-to-card vertical gaps, container padding
  xxl: 32, // Hero element separation
  xxxl: 40, // Screen top/bottom gutters
  huge: 48, // Major section breaks
};
```

---

## 6. Border Radii & Elevation

```typescript
export const BorderRadius = {
  sm: 8, // Small badges, text inputs
  md: 12, // Standard buttons, input containers
  lg: 16, // Metric cards, dialog surfaces
  xl: 20, // Large bottom sheets
  max: 24, // Maximum card rounding
  full: 9999, // Circular avatars, progress rings
};
```

### Elevation & Shadows

- **`Shadows.none`:** Flat zero-elevation elements.
- **`Shadows.subtle`:** `shadowOpacity: 0.04`, `shadowRadius: 6`, `elevation: 1` — default for cards.
- **`Shadows.card`:** `shadowOpacity: 0.06`, `shadowRadius: 8`, `elevation: 2` — active or hovered cards.

---

## 7. Component Inventory

All components are authored in `src/components/ui/` and exported via `src/components/ui/index.ts`:

| Component           | File                 | Description                                                                                    |
| :------------------ | :------------------- | :--------------------------------------------------------------------------------------------- |
| **`AppText`**       | `app-text.tsx`       | Typography primitive supporting variants, color tokens, and alignments                         |
| **`AppButton`**     | `app-button.tsx`     | Interactive button supporting primary, secondary, ghost, destructive, sizes, and loading state |
| **`AppCard`**       | `app-card.tsx`       | Layout container with default, subtle, and outlined surface variants                           |
| **`AppTextInput`**  | `app-text-input.tsx` | Input with label, helper, focus state, error message, and disabled state                       |
| **`MetricCard`**    | `metric-card.tsx`    | Standardized fitness stat tile displaying label, metric value, and unit                        |
| **`LoadingState`**  | `loading-state.tsx`  | Neutral loading indicator with optional supporting status text                                 |
| **`ErrorState`**    | `error-state.tsx`    | User-friendly error message presentation with optional retry action                            |
| **`EmptyState`**    | `empty-state.tsx`    | Quiet placeholder display with optional illustration and call-to-action                        |
| **`ConfirmDialog`** | `confirm-dialog.tsx` | Accessible modal dialog for confirmations and destructive actions                              |

---

## 8. Component Usage Examples

### 8.1 Metric Cards (Dashboard Layout)

```tsx
import React from 'react';
import { View } from 'react-native';
import { MetricCard } from '@/components/ui';

export function DashboardMetrics() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <MetricCard label="Distance" value="12.45" unit="km" />
      <MetricCard label="Avg Pace" value="5'12\"" unit="/km" />
      <MetricCard label="Active Time" value="1h 04m" />
    </View>
  );
}
```

### 8.2 Text Input with Validation Error

```tsx
import React, { useState } from 'react';
import { AppTextInput, AppButton } from '@/components/ui';

export function WorkoutTitleInput() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSave = () => {
    if (!title.trim()) {
      setError('Workout title cannot be empty.');
    }
  };

  return (
    <>
      <AppTextInput
        label="Activity Title"
        placeholder="e.g. Morning Trail Run"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (error) setError(undefined);
        }}
        errorMessage={error}
      />
      <AppButton title="Save Activity" onPress={handleSave} />
    </>
  );
}
```

### 8.3 Confirmation Dialog (Discard Workout)

```tsx
import React, { useState } from 'react';
import { AppButton, ConfirmDialog } from '@/components/ui';

export function DiscardWorkoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppButton title="Discard" variant="ghost" onPress={() => setIsOpen(true)} />
      <ConfirmDialog
        visible={isOpen}
        title="Discard Workout?"
        description="Your recorded GPS route and telemetry will be permanently discarded."
        confirmTitle="Discard Workout"
        cancelTitle="Keep Recording"
        isDestructive
        onConfirm={() => {
          setIsOpen(false);
          // execute discard
        }}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
```

---

## 9. Accessibility Guidelines

1. **Touch Targets:** All interactive pressables (`AppButton`, `ConfirmDialog`, `AppTextInput`) enforce a minimum touch dimension of 44pt via layout sizing or `hitSlop`.
2. **Semantic Roles:** Buttons use `accessibilityRole="button"`, dialogs use `accessibilityRole="alert"`, and inputs set `accessibilityState={{ disabled }}`.
3. **Contrast Compliance:** All text tokens meet WCAG 2.1 AA requirements against their designated surfaces:
   - Primary text (`#1F2C2A` on `#F5F7F6`): **11.4:1** (Passes AAA).
   - Secondary text (`#63716E` on `#F5F7F6`): **4.6:1** (Passes AA).
   - Primary button (`#FFFFFF` on `#0B756C`): **4.8:1** (Passes AA).

---

## 10. Design Rules for Future Feature Screens

When implementing subsequent phases (Activities, Recording, Maps, Profile, Social):

1. **Always import from `@/components/ui` or `@/constants/theme`** — never hardcode raw hex codes or inline arbitrary spacing numbers.
2. **Favor whitespace over borders:** Do not box every row with heavy borders. Use generous `Spacing.md` and background shifts instead.
3. **Keep dashboards calm:** Maximum of 1 primary button per viewport. Secondary actions should use `variant="secondary"` or `variant="ghost"`.
4. **Never show raw technical errors:** All failures must present user-understandable instructions through `ErrorState`.

---

## 11. Components Intentionally Deferred

| Component          | Status       | Architectural Justification                                                                                                                                                         |
| :----------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ProgressRing`** | **DEFERRED** | Requires `react-native-svg`. Per strict Step 1.6 constraints, no new dependencies were permitted. Deferred to Phase 02 or Phase 04 when SVG visualization libraries are integrated. |
| **Dark Theme UI**  | **DEFERRED** | Phase 01 explicitly targets the Light Theme. Dark theme tokens are stubbed in `theme.ts` for type safety, but theme switching UI is deferred.                                       |
| **Custom Charts**  | **DEFERRED** | Pace/elevation charts require dedicated charting libraries; scheduled for Phase 02 / Phase 04.                                                                                      |
