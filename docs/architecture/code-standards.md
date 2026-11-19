# Code Standards and Development Tooling

**Project:** Strava-Inspired Fitness & Outdoor Activity Application  
**Phase:** 01 — Project Initialization and Architecture  
**Step:** 1.4 — Development Tooling and Code Standards  
**Status:** Implemented & Verified

---

## 1. Overview & Architecture Philosophy

This document defines the code standards, static analysis rules, formatting conventions, testing guidelines, and dependency management workflows for the application.

Consistency, type safety, and automated quality gates are critical to maintaining code quality as features scale across authentication, GPS activity tracking, interactive mapping, social feeds, and offline data synchronization.

### Toolchain Summary

| Tool                             | Version / Preset                 | Purpose                                                               |
| :------------------------------- | :------------------------------- | :-------------------------------------------------------------------- |
| **TypeScript**                   | `~6.0.3` (`expo/tsconfig.base`)  | Static type checking and compile-time contract enforcement            |
| **ESLint**                       | `^9.39.5` (Flat Config)          | Code quality, React/React Native best practices, hook safety          |
| **eslint-config-expo**           | `~58.0.4` (`/flat`)              | Expo-curated linting rules for React 19, TypeScript, and React Native |
| **Prettier**                     | `^3.10.1`                        | Opinionated, deterministic code formatting across all files           |
| **Jest**                         | `~30.5.2` (`jest-expo ~58.0.15`) | Unit and integration test runner with Expo/React Native mocking       |
| **React Native Testing Library** | `^14.1.0`                        | User-centric UI testing using async component rendering               |
| **EditorConfig**                 | Core standard (`.editorconfig`)  | Cross-editor baseline for indentation, line endings, and charset      |

---

## 2. TypeScript Standards & Strictness Rules

The project inherits Expo's base TypeScript configuration (`expo/tsconfig.base`) and enforces strict compiler settings in `tsconfig.json`.

### 2.1 Compiler Configuration

- **Inheritance:** `extends: "expo/tsconfig.base"` ensures compatibility with Expo CLI, Babel/Metro, and Expo Router.
- **Strict Mode:** `"strict": true` enables:
  - `noImplicitAny`
  - `strictNullChecks`
  - `strictFunctionTypes`
  - `strictBindCallApply`
  - `strictPropertyInitialization`
  - `noImplicitThis`
  - `alwaysStrict`
- **Output:** `"noEmit": true` — TypeScript is used strictly for type checking; Metro handles JavaScript bundling.
- **Path Aliases:** `"@/*": ["./src/*"]` and `"@/assets/*": ["./assets/*"]`.
- **Global Types:** `"types": ["jest"]` enables Jest test assertion typings alongside `expo-env.d.ts` and `.expo/types/**/*.ts`.

### 2.2 Coding Standards for TypeScript

1. **Explicit Function & Component Signatures:**
   Always declare explicit return types on public functions, custom hooks, and React components.
   ```tsx
   // Recommended
   export function StatBadge({ label, value }: StatBadgeProps): React.JSX.Element {
     return (
       <View>
         <ThemedText type="defaultSemiBold">{label}</ThemedText>
         <ThemedText>{value}</ThemedText>
       </View>
     );
   }
   ```
2. **Avoid `any`:**
   Do not use `any`. Use `unknown` combined with type narrowing (type guards, discriminated unions, or `zod` schemas).
3. **No Blanket Suppressions:**
   Never use `@ts-nocheck`. Avoid `@ts-ignore` unless interfacing with an untyped third-party module where no type definitions exist; in such cases, always include an explanatory comment:
   ```ts
   // @ts-expect-error: third-party native package lacks TypeScript export for web
   ```
4. **Discriminated Unions for State:**
   Model asynchronous states (e.g., GPS tracking, network requests) with discriminated unions rather than multiple boolean flags:
   ```ts
   export type TrackingState =
     | { status: 'idle' }
     | { status: 'recording'; startTime: number; distanceMeters: number }
     | { status: 'paused'; elapsedTimeMs: number }
     | { status: 'finished'; summary: ActivitySummary };
   ```

---

## 3. ESLint Configuration & Enforcement

The project utilizes the modern ESLint Flat Configuration format (`eslint.config.js`).

### 3.1 Flat Config Structure

```javascript
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  ...expoConfig,
  prettierRecommended,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'coverage/**',
      'android/**',
      'ios/**',
      'scripts/**',
      'expo-env.d.ts',
    ],
  },
];
```

### 3.2 Rules Enforced

- **React & React Native Hooks:** Enforces Rules of Hooks (`react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`).
- **React 19 Compatibility:** Enforces pure rendering without side-effects during component rendering. Hydration or external subscriptions must use `useSyncExternalStore` rather than calling `setState` inside `useEffect`.
- **TypeScript Rules:** `@typescript-eslint/no-unused-vars` triggers warnings on unreferenced variables (except those prefixed with `_`).
- **Prettier Integration:** Prettier formatting rules are surfaced as ESLint errors/warnings via `eslint-plugin-prettier`, while conflicting ESLint rules are disabled via `eslint-config-prettier`.

---

## 4. Prettier Formatting Standards

All files in the workspace must adhere to formatting rules defined in `.prettierrc.json`.

### 4.1 Configuration Options

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 4.2 Formatting Enforcement

- Format code: `npm run format`
- Check code formatting in CI: `npm run format:check`
- Prettier ignore rules are maintained in `.prettierignore` (ignoring `node_modules`, `.expo`, `dist`, `coverage`, `package-lock.json`, and generated types).

---

## 5. Import Order & Path Alias Conventions

To maintain clean diffs and avoid circular dependencies, follow standard module grouping and absolute path aliases.

### 5.1 Import Grouping Order

Imports must be organized into distinct groups separated by a blank line:

1. **React & React Native core:**
   ```tsx
   import React, { useState, useEffect } from 'react';
   import { View, StyleSheet, Pressable } from 'react-native';
   ```
2. **Expo & First-Party Framework libraries:**
   ```tsx
   import { router, Link } from 'expo-router';
   import { SymbolView } from 'expo-symbols';
   import * as Location from 'expo-location';
   ```
3. **Third-Party Libraries:**
   ```tsx
   import { render, screen } from '@testing-library/react-native';
   ```
4. **Internal Shared Components & Hooks (`@/` alias):**
   ```tsx
   import { ThemedText } from '@/components/ui/themed-text';
   import { ThemedView } from '@/components/ui/themed-view';
   import { useColorScheme } from '@/hooks/use-color-scheme';
   import { Colors } from '@/constants/theme';
   ```
5. **Feature Modules (`@/features/...`):**
   ```tsx
   import { ActivityCard } from '@/features/feed/components/activity-card';
   import { useActivityTracker } from '@/features/recording/hooks/use-activity-tracker';
   ```
6. **Types & Interfaces:**
   ```tsx
   import type { Activity } from '@/features/activities/types/activity';
   import type { UserProfile } from '@/features/profile/types/profile';
   ```
7. **Relative Imports (same directory only):**
   ```tsx
   import { helperFunction } from './local-helper';
   ```
8. **Styles & Static Assets:**
   ```tsx
   import '@/global.css';
   ```

### 5.2 Path Alias Conventions

- Always prefer the `@/` prefix for imports outside the current directory:
  - Good: `import { ThemedText } from '@/components/ui/themed-text';`
  - Avoid: `import { ThemedText } from '../../../components/ui/themed-text';`
- Do not import feature-specific internals into shared UI components (`src/components/ui/` must remain independent of `src/features/`).

---

## 6. Testing Conventions

Testing ensures application reliability across navigation, business logic, and UI interactions.

### 6.1 Testing Stack

- **Runner:** Jest (`jest-expo` preset).
- **UI Testing:** `@testing-library/react-native` (v14.1.0).
- **Configuration:** `jest.config.js` with module alias mapping:
  - `'\\.css$': '<rootDir>/src/tests/fixtures/styleMock.js'`
  - `'^@/(.*)$': '<rootDir>/src/$1'`

### 6.2 Test Organization

```text
src/tests/
├── fixtures/        # Mock data stubs, mock CSS modules, test builders
├── integration/     # Cross-feature workflows, route navigation tests
└── unit/            # Pure functions, utility tests, isolated component tests
```

### 6.3 React Native Testing Library v14 Guidelines

- **Asynchronous Rendering:** In React 19 / RNTL v14, `render()` is asynchronous and returns a Promise. Always `await` the render call:
  ```tsx
  import React from 'react';
  import { render, screen } from '@testing-library/react-native';
  import { ThemedText } from '@/components/ui/themed-text';

  describe('ThemedText Component', () => {
    it('renders child text content correctly', async () => {
      await render(<ThemedText>Hello Fitness</ThemedText>);
      expect(screen.getByText('Hello Fitness')).toBeTruthy();
    });
  });
  ```
- **Query Priorities:** Follow RTL recommendations:
  1. Accessible queries (`getByRole`, `getByLabelText`, `getByText`)
  2. TestID queries (`getByTestId`) only when accessible elements are not suitable.
- **Do NOT Install Deprecated Packages:**
  - `react-test-renderer` is incompatible and deprecated in React 19.
  - `@testing-library/jest-native` is built directly into modern RNTL.

---

## 7. Dependency Management Rules

Expo applications have strict native version compatibility requirements governed by the Expo SDK release.

### 7.1 Mandatory Installation Commands

1. **Always use `npx expo install`:**
   ```bash
   npx expo install <package-name>
   ```
   This automatically resolves the exact version validated for Expo SDK 58.
2. **Never use direct `npm install <package-name>` for native modules:**
   Direct npm installation may introduce incompatible native bindings that fail during EAS compilation or break Metro.
3. **Development Tooling:**
   Install dev dependencies using:
   ```bash
   npx expo install --dev <package-name>
   ```

### 7.2 Dependency Health Audits

- Diagnose dependency compatibility:
  ```bash
  npx expo-doctor
  ```
- Automatically resolve mismatched versions:
  ```bash
  npx expo install --fix
  ```
- Keep `package-lock.json` committed and synchronized.

---

## 8. Development Scripts & Workflow

All routine development tasks are encapsulated into standard npm scripts:

| Command                | Script Command                                                              | Description                                            |
| :--------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------- |
| `npm run start`        | `expo start`                                                                | Starts the Metro development server                    |
| `npm run android`      | `expo start --android`                                                      | Starts Metro with Android emulator target              |
| `npm run ios`          | `expo start --ios`                                                          | Starts Metro with iOS simulator target                 |
| `npm run web`          | `expo start --web`                                                          | Starts Metro with web browser target                   |
| `npm run typecheck`    | `tsc --noEmit`                                                              | Executes full TypeScript type check                    |
| `npm run lint`         | `eslint .`                                                                  | Runs ESLint analysis across the repository             |
| `npm run lint:fix`     | `eslint . --fix`                                                            | Automatically fixes auto-fixable lint issues           |
| `npm run format`       | `prettier --write .`                                                        | Formats all matching files in-place                    |
| `npm run format:check` | `prettier --check .`                                                        | Verifies code conforms to Prettier rules               |
| `npm test`             | `jest --runInBand`                                                          | Runs the test suite                                    |
| `npm run test:watch`   | `jest --watch`                                                              | Runs Jest in interactive watch mode                    |
| `npm run test:ci`      | `jest --ci --runInBand`                                                     | Runs tests in deterministic CI mode                    |
| `npm run validate`     | `npm run typecheck && npm run lint && npm run format:check && npm run test` | Unified quality gate for local checks and CI           |
| `npm run clean`        | Cross-platform `.expo` cleanup                                              | Clears `.expo` cache safely across Windows/Linux/macOS |

---

## 9. Pre-Commit / Pull Request Checklist

Before submitting a pull request or committing changes:

1. [ ] **Clean Git Tree:** No unintended scratch files or secrets.
2. [ ] **Typecheck Passes:** `npm run typecheck` exits with code 0.
3. [ ] **Lint Passes:** `npm run lint` reports 0 errors and 0 warnings.
4. [ ] **Format Passes:** `npm run format:check` reports all files match Prettier style.
5. [ ] **Tests Pass:** `npm test` passes 100% of test suites.
6. [ ] **Unified Gate:** `npm run validate` succeeds without error.
7. [ ] **Expo Doctor:** `npx expo-doctor` reports no dependency or configuration warnings.
8. [ ] **Dependency Rule Checked:** Any added package was installed via `npx expo install`.
