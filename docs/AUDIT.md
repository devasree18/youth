# YOUTH Platform — Comprehensive Repository Audit Report

**Date:** September 9, 2026  
**Auditor:** CTO & Principal Security Architect  
**Repository:** `YOUTH` (Mental Health & Wellbeing SaaS Platform)  

---

## 1. Executive Summary

This audit evaluates the codebase of **YOUTH**, a mental-health and enterprise wellbeing SaaS platform. The audit covers repository architecture, frontend/backend code structure, security posture, database schemas, RBAC, multi-tenancy, AI integration, billing, crisis safety, and test coverage.

### Key Metrics & Status Baseline

| Category | Finding / Metric | Status / Assessment |
| --- | --- | --- |
| **Backend Stack** | Express 5.x, Mongoose 9.x, TypeScript 5.4 | Functional base, unversioned API routes |
| **Frontend Stack** | React 19, Vite 8, Tailwind 4, Framer Motion | Modern stack, missing route integration & error boundaries |
| **TypeScript Strictness** | Enabled in `tsconfig.json` | Polluted with `any` in route handlers; build artifacts in `src/` |
| **Security Posture** | Fallback secrets, `origin: '*'`, JWT in localStorage | **CRITICAL RISKS** |
| **Multi-Tenancy** | Global un-scoped queries in institution routes | **CRITICAL RISK** |
| **Crisis Safety** | Dead link to `/crisis` from Dashboard | **CRITICAL RISK** |
| **Test Coverage** | 0% (No test framework configured) | **HIGH RISK** |
| **Build Status** | Backend `npm run build` PASS (tsc output to `dist/`), Frontend PASS | PASS (after clean package install) |

---

## 2. Comprehensive Issue Audit Log

| ID | Category | Severity | Evidence | Impact | Recommendation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `SEC-001` | Security | Critical | `backend/src/middleware/auth.ts:14`, `backend/src/routes/auth.ts:33,63` | Hardcoded `fallback_secret` allows JWT forgery if environment variable is omitted | Fail server startup if `JWT_SECRET` is missing. Remove all fallback secrets. | NOT IMPLEMENTED |
| `SEC-002` | Security | High | `backend/src/server.ts:25` | Permissive `cors({ origin: '*' })` exposes API to unauthorized cross-origin requests | Restrict origins via environment configuration (`ALLOWED_ORIGINS`). | NOT IMPLEMENTED |
| `SEC-003` | Security | High | `frontend/src/context/AuthContext.tsx:47,62`, `AiAssistant.tsx:42` | Long-lived JWT tokens stored in `localStorage` vulnerable to XSS | Implement short-lived tokens and secure `HttpOnly`, `SameSite` refresh-token cookies. | NOT IMPLEMENTED |
| `API-001` | Architecture | High | `backend/src/server.ts:51-61` | Unversioned API routes (`/api/auth` vs `/api/v1/auth`), inconsistent JSON envelope | Version all endpoints under `/api/v1/` and standardize `{ success, data, error, meta: { requestId } }`. | NOT IMPLEMENTED |
| `API-002` | API / Frontend | High | `frontend/src/pages/AiAssistant.tsx:37` | Hardcoded `http://localhost:5000/api/ai/chat` in fetch call | Centralize API calls in a unified `apiClient` using relative paths or `VITE_API_URL`. | NOT IMPLEMENTED |
| `TENANT-001` | Multi-Tenancy | Critical | `backend/src/routes/institution.ts:24` | `User.countDocuments({ role: 'student' })` counts all platform users without tenant isolation | Add `tenantId` / `institutionId` to all models and enforce scoped middleware queries. | NOT IMPLEMENTED |
| `RBAC-001` | Authorization | High | `backend/src/routes/admin.ts:11`, `routes/institution.ts:12` | String role checks without granular permissions (`users.read`, `institution.analytics`) | Implement explicit permission matrix with RBAC & tenant context middleware. | NOT IMPLEMENTED |
| `WELL-001` | Core Product | High | `frontend/src/pages/Dashboard.tsx:81` | Mood selector only updates React state (`setSelectedMood`), does not call `/api/mood` | Wire mood selection to `POST /api/v1/mood` with database persistence. | NOT IMPLEMENTED |
| `WELL-002` | Core Product | High | `frontend/src/pages/Dashboard.tsx:132` | Hardcoded Wellbeing Score (72) displayed as real user metric | Calculate real dynamic score based on historical mood entries and assessment results. | NOT IMPLEMENTED |
| `AI-001` | AI Architecture | High | `backend/src/routes/ai.ts:12` | Hardcoded static string mock response in AI chat route | Build multi-provider `AIService` abstraction (Gemini / OpenAI), safety layer, rate limiting, and prompt policies. | NOT IMPLEMENTED |
| `CRISIS-001` | Crisis Safety | Critical | `frontend/src/pages/Dashboard.tsx:43`, `App.tsx` | Dashboard "Urgent Help" links to `/crisis` which is not defined in `App.tsx` (404) | Create dedicated `/crisis` route, emergency hotline directory, and safety classification flow. | NOT IMPLEMENTED |
| `BILL-001` | Billing | High | `backend/src/routes/subscriptions.ts:13` | POST `/api/subscriptions` creates active subscription with no payment verification | Build plan entitlement models, Razorpay/Stripe provider abstraction, and webhook signature verification. | NOT IMPLEMENTED |
| `HYG-001` | DevOps / Build | Medium | `backend/src/*.js`, `backend/src/**/*.js`, `backend/src/*.d.ts` | Compiled JavaScript and type declaration files committed directly inside `backend/src` | Clean source directory artifacts, enforce `outDir: ./dist` in `tsconfig.json`, update `.gitignore`. | NOT IMPLEMENTED |
| `TEST-001` | Testing | High | `backend/package.json:11` | Missing automated unit, integration, and E2E test suites (`echo "Error: no test specified"`) | Configure Vitest / Jest, add auth, RBAC, tenant isolation, assessment, and API unit/integration tests. | NOT IMPLEMENTED |

---

## 3. Deployment & Environment Review

- **Vercel Setup:** `vercel.json` maps `/api/(.*)` to `backend/src/server.ts` using `@vercel/node`.
- **Environment Handling:** Backend relies on optional `MONGODB_URI` and optional `JWT_SECRET`. Server starts even when secrets are completely missing.
- **Frontend Environment Variables:** Uses `import.meta.env.VITE_API_URL` falling back to `/api`, but `AiAssistant.tsx` bypasses this with a hardcoded `localhost:5000` string.

---

## 4. Audit Conclusion & Baseline Verification Result

- **Backend TypeScript Compilation:** `npm run build` -> PASS (Output: `dist/server.js`)
- **Frontend Vite Build:** `npm run build` -> PASS (Output: `dist/`)
- **Frontend Oxlint:** `npm run lint` -> 4 Warnings (setState in effect, unused catch param, component export rules).
- **Test Suite Execution:** 0 tests present.

The repository requires systematic refactoring and transformation to fulfill all master prompt requirements.
