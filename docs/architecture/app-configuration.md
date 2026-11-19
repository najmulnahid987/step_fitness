# Application Configuration & Environment Architecture

**Project:** Strava-Inspired Fitness & Outdoor Activity Application  
**Phase:** 01 — Project Initialization and Architecture  
**Step:** 1.5 — App Identity, Expo Configuration & Environment Setup  
**Status:** Implemented & Verified

---

## 1. Application Identity

The application is provisioned with a provisional development identity:

- **Application Name:** `Fitness Activity`
- **Expo Slug:** `fitness-activity`
- **Application Version:** `1.0.0`
- **URL Scheme:** `fitnessactivity` (for deep linking and OAuth redirects)

> [!IMPORTANT]
> The product name `Fitness Activity` and bundle identifiers are provisional placeholders for development. The final branded product name, marketing assets, and globally unique store identifiers must be verified and registered before public submission to the Apple App Store and Google Play Store. Strava trademarks and proprietary logos are strictly excluded.

---

## 2. Platform Identifiers

### Android

- **Package ID:** `com.example.fitnessactivity`
- **Target OS:** Android 14+ (API 34 target standard for SDK 58)
- **Predictive Back Gestures:** Disabled (`predictiveBackGestureEnabled: false`)

### iOS

- **Bundle Identifier:** `com.example.fitnessactivity`
- **Tablet Support:** Disabled (`supportsTablet: false`, mobile-first handset target)
- **Icon Set:** SF Symbols and adaptive asset catalogs (`assets/expo.icon`)

---

## 3. URL Scheme and Deep Linking

- **Scheme:** `fitnessactivity://`
- Used by Expo Router and `expo-linking` for in-app navigation, deep links from web links or notifications, and external authentication callbacks (e.g., Supabase OAuth redirect `fitnessactivity://auth/callback`).

---

## 4. Expo Configuration Structure (`app.json`)

```json
{
  "expo": {
    "name": "Fitness Activity",
    "slug": "fitness-activity",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "fitnessactivity",
    "userInterfaceStyle": "automatic",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.example.fitnessactivity",
      "icon": "./assets/expo.icon"
    },
    "android": {
      "package": "com.example.fitnessactivity",
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "server",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#ffffff",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Allow Fitness Activity to access your location while you record a workout so we can measure distance, pace and display your route.",
          "locationAlwaysAndWhenInUsePermission": "Allow Fitness Activity to continue recording your workout when you switch applications or turn off your screen."
        }
      ],
      "expo-sqlite"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

---

## 5. Asset Locations & Placeholders

All graphics currently utilize Expo SDK 58 template assets as temporary placeholders:

| Asset                  | Path                                        | Role                                 | Status / Plan                                  |
| :--------------------- | :------------------------------------------ | :----------------------------------- | :--------------------------------------------- |
| **App Icon**           | `assets/images/icon.png`                    | Universal app launcher icon          | Placeholder (to be replaced in Branding Phase) |
| **iOS Icon Catalog**   | `assets/expo.icon`                          | iOS native layered symbol icon       | Placeholder                                    |
| **Android Foreground** | `assets/images/android-icon-foreground.png` | Adaptive icon foreground             | Placeholder                                    |
| **Android Background** | `assets/images/android-icon-background.png` | Adaptive icon background (`#E6F4FE`) | Placeholder                                    |
| **Android Monochrome** | `assets/images/android-icon-monochrome.png` | Themed/Material You launcher         | Placeholder                                    |
| **Splash Screen Icon** | `assets/images/splash-icon.png`             | Center icon on splash screen         | Placeholder (on neutral `#ffffff` background)  |
| **Web Favicon**        | `assets/images/favicon.png`                 | Browser tab icon for web builds      | Placeholder                                    |

---

## 6. Location Permissions & Privacy Configuration

Location capabilities are configured through the first-party `expo-location` config plugin.

### iOS Permission Purpose Strings

- **When In Use (`NSLocationWhenInUseUsageDescription`):**  
  `"Allow Fitness Activity to access your location while you record a workout so we can measure distance, pace and display your route."`
- **Always and When In Use (`NSLocationAlwaysAndWhenInUseUsageDescription`):**  
  `"Allow Fitness Activity to continue recording your workout when you switch applications or turn off your screen."`

### Android Permissions

- Auto-configured by `expo-location`:
  - `android.permission.ACCESS_COARSE_LOCATION`
  - `android.permission.ACCESS_FINE_LOCATION`

### Current Background Location Status (Phase 01)

> [!NOTE]
> During Phase 01, location permissions are configured at the manifest/plugin level only.
>
> - **Runtime permission requests are NOT invoked during startup.**
> - **Android `ACCESS_BACKGROUND_LOCATION` is NOT activated.**
> - **Foreground location services (`FOREGROUND_SERVICE_LOCATION`) are NOT activated.**
>   Full background GPS registration and user opt-in dialogs are scheduled for the dedicated GPS Tracking implementation phase (Phase 04).

---

## 7. Foundational Native Dependencies

Installed via Expo's version-pinned package manager (`npx expo install`):

| Package                 | Version    | Architectural Responsibility                                                 |
| :---------------------- | :--------- | :--------------------------------------------------------------------------- |
| **`expo-location`**     | `~58.0.22` | Core GPS location provider, distance measurement, and geofencing             |
| **`expo-task-manager`** | `~58.0.14` | Background execution harness for recording workouts when screen is locked    |
| **`expo-sqlite`**       | `~58.0.18` | High-performance embedded SQLite database for local offline activity caching |
| **`zod`**               | `^4.6.7`   | Type-safe runtime schema validation for environment and domain models        |

---

## 8. Environment Variable Architecture & Security

### Public Configuration vs Secrets

Mobile client applications execute directly on user devices and can be reverse-engineered or decompiled. Therefore:

- **Public Configuration (`EXPO_PUBLIC_*`):**
  - Baked directly into the JavaScript bundle during compile time.
  - Safe for public API endpoints (`EXPO_PUBLIC_SUPABASE_URL`) and public client tokens (`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
  - Safe for runtime flags (`EXPO_PUBLIC_APP_ENV`).
- **Forbidden Secrets (NEVER in mobile client):**
  - Supabase `service_role` keys (bypasses Row Level Security).
  - Database admin credentials / connection strings.
  - Private third-party API secrets or server signing keys.
  - All database security relies on **PostgreSQL Row Level Security (RLS)** policies enforced by Supabase.

### Environment Files Convention

- **`.env.example`:** Committed template documenting variable names:
  ```env
  EXPO_PUBLIC_APP_ENV=development

  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
  ```
- **`.env` / `.env.local`:** Ignored by Git in `.gitignore` to prevent secret leakage.

---

## 9. Runtime Environment Validation (`src/config/env.ts`)

Runtime validation occurs synchronously during application boot via an import in `src/app/_layout.tsx`:

```typescript
import { env } from '@/config/env';
```

### Validation Rules

1. **`appEnv`:** Must be `'development'`, `'preview'`, or `'production'` (defaults to `'development'`).
2. **Supabase Optionality:** In Phase 01, Supabase variables are optional to allow local development and testing without network dependencies.
3. **Co-dependency Validation:**
   - If `EXPO_PUBLIC_SUPABASE_URL` is provided, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is strictly required.
   - If `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is provided, `EXPO_PUBLIC_SUPABASE_URL` is strictly required.
4. **URL Format:** `EXPO_PUBLIC_SUPABASE_URL` must be a valid `http:` or `https:` URL.
5. **Security Error Sanitization:** Under no circumstances are raw key contents printed to logs or error messages.

---

## 10. Future Integrations Roadmap

- **Phase 03 (Backend & Auth):** Populate `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with live Supabase project credentials.
- **Phase 04 (GPS Tracking):** Activate `expo-task-manager` headless tasks and foreground service notifications for Android workouts.
- **Phase 05 (Map Integration):** Evaluate Mapbox or Google Maps native provider API keys and configure native config plugins.
