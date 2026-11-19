# Git Workflow & Continuous Integration Guide

**Project:** Fitness Activity — Strava-Inspired Fitness & Outdoor Activity Application  
**Phase:** 01 — Project Initialization and Architecture  
**Step:** 1.7 — Git Workflow, GitHub Repository & Continuous Integration  
**Status:** Established & Verified

---

## 1. Why the Project Uses Git

Git is the foundation for source code management, collaboration, traceability, and release stability. In this project:

- Every feature, bug fix, and architectural enhancement is isolated in dedicated branches.
- Commit history provides an immutable audit trail of technical decisions.
- Automated Continuous Integration (CI) validates code quality before any code reaches the production branch.
- Secret and environment boundaries are strictly protected at the version-control level.

---

## 2. Primary Branch: `main`

The `main` branch represents the canonical, stable, production-ready source of truth:

- **Direct commits to `main` are strictly prohibited.**
- All code changes must be submitted through **Pull Requests (PRs)** targeting `main`.
- Merging into `main` requires:
  1. Passing automated GitHub Actions CI pipeline.
  2. Peer review and approval (in team environments).
  3. Clean merge resolution without force pushes.

---

## 3. Branch Naming Conventions

All branch names must be lowercase, hyphen-separated, and prefixed with a standardized category tag:

| Prefix      | Category              | Example                      | Purpose                                               |
| :---------- | :-------------------- | :--------------------------- | :---------------------------------------------------- |
| `feature/`  | New functionality     | `feature/gps-recording`      | Implementing a new user capability or screen          |
| `fix/`      | Bug correction        | `fix/pace-calculation-zero`  | Resolving a bug, defect, or edge-case failure         |
| `refactor/` | Code improvement      | `refactor/location-service`  | Restructuring internal logic without behavior changes |
| `docs/`     | Documentation         | `docs/api-architecture`      | Authoring or updating Markdown architecture guides    |
| `chore/`    | Tooling & maintenance | `chore/update-dependencies`  | Updating configs, scripts, or build tooling           |
| `test/`     | Automated testing     | `test/auth-repository-mocks` | Authoring unit or integration test suites             |

---

## 4. Commit Message Conventions

The repository follows a clean **Conventional Commits** format:

```text
<type>: <short imperative summary>

[optional body explaining context or rationale]
```

### Commit Types

- `feat:` Adds a new feature or public capability.
- `fix:` Fixes a defect or bug.
- `refactor:` Code refactoring that neither fixes a bug nor adds a feature.
- `docs:` Documentation updates only.
- `test:` Adding missing tests or correcting existing tests.
- `chore:` Maintenance tasks, dependency version updates, or build configs.

### Examples

```text
feat: add ActivityCard metric display in feed
fix: prevent NaN result when activity duration is 0
refactor: consolidate theme tokens in src/constants/theme.ts
docs: author Git workflow and CI pipeline guide
test: add unit tests for ConfirmDialog component
chore: configure cross-platform .gitattributes line endings
```

---

## 5. Step-by-Step Development Workflow

### Step 5.1 — Updating Your Local `main`

Always start your work from an up-to-date `main` branch:

```powershell
# Switch to main
git switch main

# Pull the latest remote commits
git pull origin main
```

### Step 5.2 — Creating a Feature Branch

Create and switch to your task branch using the appropriate prefix:

```powershell
git switch -c feature/activity-recording
```

### Step 5.3 — Developing & Verifying Locally

Make your changes in the workspace. Before committing, run the complete validation suite:

```powershell
# Run full quality gate (typecheck, lint, format check, tests)
npm run validate

# Verify Expo compatibility
npx expo-doctor
npx expo install --check
```

### Step 5.4 — Staging and Committing Changes

Stage specific files intentionally (never run `git add .` blindly):

```powershell
# Inspect modified and untracked files
git status --short

# Stage specific files
git add src/features/recording/
git add src/tests/unit/recording.test.ts

# Commit with a conventional message
git commit -m "feat: implement GPS recording state machine"
```

### Step 5.5 — Pushing to GitHub & Opening a PR

Push your branch to GitHub and create an upstream tracking reference:

```powershell
git push -u origin feature/activity-recording
```

Open a Pull Request on GitHub targeting `main`:

1. Provide a clear title and summary of changes.
2. Link relevant issues or phase tasks.
3. Verify that the GitHub Actions CI pipeline passes.
4. Request review from teammates.

---

## 6. Continuous Integration (CI) Pipeline

Automated checks are executed via GitHub Actions on every push to branches and pull requests targeting `main`.

### Workflow File: `.github/workflows/ci.yml`

The CI runner executes on an isolated `ubuntu-latest` VM with the Node.js version pinned by `.nvmrc` (`24.21.0`).

### Automated CI Steps

1. **Repository Checkout:** `actions/checkout@v6`
2. **Node.js Environment Setup:** `actions/setup-node@v7` (reads `.nvmrc`, caches npm packages)
3. **Clean Installation:** `npm ci` verifies strict dependency lockfile reproducibility.
4. **Unified Quality Gate:** `npm run validate`
   - `tsc --noEmit` (Strict TypeScript compiler verification)
   - `eslint .` (ESLint flat configuration static analysis)
   - `prettier --check .` (Prettier deterministic code formatting)
   - `jest --runInBand` (Full unit test suite execution)
5. **Expo Doctor Diagnostics:** `npx expo-doctor` validates 20 Expo health checks.
6. **Expo Dependency Check:** `npx expo install --check` verifies SDK 58 module alignment.

### What to Do When CI Fails

1. Check the failed step in the GitHub Actions workflow log.
2. Reproduce the failure locally on your workstation:
   - If TypeScript failed: run `npm run typecheck`
   - If ESLint failed: run `npm run lint` (or `npm run lint:fix`)
   - If Prettier failed: run `npm run format`
   - If Tests failed: run `npm test`
3. Commit the correction and push to your branch. GitHub Actions will re-run automatically.

---

## 7. Environment Variables & Secret Protection

### Security Invariants

- **Never commit `.env` or local credential files.**
- `.gitignore` is configured with strict secret patterns:
  ```gitignore
  .env
  .env.*
  !.env.example
  ```
- **Only public variables prefixed with `EXPO_PUBLIC_`** can be included in the mobile client.
- Database service-role keys, backend private keys, and signing secrets are strictly forbidden from the mobile codebase.
- Maintain [.env.example](file:///D:/projects_mobile/step_counter/project/.env.example) as an updated reference with empty placeholder values.

---

## 8. Cross-Platform Line Endings (`.gitattributes`)

To avoid phantom diffs caused by Windows CRLF vs Linux/macOS LF line endings, [.gitattributes](file:///D:/projects_mobile/step_counter/project/.gitattributes) normalizes all text files to LF:

```gitattributes
* text=auto eol=lf
```

---

## 9. Recommended GitHub Branch Protection Settings

When the repository is pushed to a remote GitHub organization/repository, configure the following branch protection rules for `main`:

1. **Require a pull request before merging:**
   - Require at least 1 approving review.
   - Dismiss stale pull request approvals when new commits are pushed.
2. **Require status checks to pass before merging:**
   - Require the status check: `Code Quality & Expo Diagnostics` (from `ci.yml`).
   - Require branches to be up to date before merging.
3. **Prevent force pushes:**
   - Disallow `git push --force` to `main`.
4. **Prevent branch deletion:**
   - Ensure `main` cannot be deleted.

---

## 10. Useful PowerShell Git Commands Reference

| Operation                       | Command                            |
| :------------------------------ | :--------------------------------- |
| Check branch & status           | `git status -sb`                   |
| View commit log                 | `git log --oneline --decorate -10` |
| Create & switch branch          | `git switch -c feature/<name>`     |
| Switch existing branch          | `git switch <name>`                |
| Discard working changes in file | `git restore <file>`               |
| Check diff before commit        | `git diff`                         |
| Check whitespace / CRLF issues  | `git diff --check`                 |
| Run full quality validation     | `npm run validate`                 |
