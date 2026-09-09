# YOUTH Platform — Product Gap Analysis

**Date:** September 9, 2026  
**Auditor:** Product Manager & Principal Architect  

---

## 1. Objective

To transform YOUTH from an early-stage prototype into an Enterprise Wellbeing SaaS platform capable of serving individual users, higher education institutions, counselor networks, and enterprise B2B customers without requiring architectural rewrites.

---

## 2. Product Capability Matrix (Current vs. Target)

| Domain Module | Current State | Target State | Gap Severity |
| --- | --- | --- | --- |
| **Auth & Sessions** | Basic registration/login, single JWT stored in localStorage | Secure session manager, short-lived tokens, HttpOnly refresh cookies, MFA-ready structure, session revocation | **CRITICAL** |
| **Multi-Tenancy** | Unscoped global queries | Scoped tenant isolation (`tenantId`, `institutionId`, `orgId`), privacy preservation, zero cross-tenant leakage | **CRITICAL** |
| **RBAC & Permissions** | Hardcoded role strings (`student`, `admin`, `institution`) | Fine-grained permission system (`users.read`, `students.analytics`, `community.moderate`, etc.) | **HIGH** |
| **Crisis Safety** | Dead link to `/crisis`, notice banner only | Dedicated crisis flow, real-time safety classifier, region-configurable helplines, audit logging | **CRITICAL** |
| **Core Wellbeing** | Visual mood check-in (unpersisted), static score 72 | Dynamic score calculation, persistent mood entries, schema-driven assessments, habits, journaling | **HIGH** |
| **AI Architecture** | Hardcoded static string mock reply in `/api/ai/chat` | Server-side `AIService` supporting Gemini & OpenAI adapters, prompt policies, token quotas, crisis interceptor | **HIGH** |
| **Community System** | Basic post creation, no moderation, no reactions/comments API | Pseudonymous posting, post/comment moderation, reporting system, reaction system, user blocking | **HIGH** |
| **Counselor Marketplace** | Read-only listing, no booking engine or schedule slotting | Counselor onboarding, availability slots, transaction-safe booking engine, status workflow, rating system | **HIGH** |
| **Institution SaaS** | 1 endpoint returning global student count | Scoped admin dashboard, member management, aggregated privacy-safe analytics, campaign management | **CRITICAL** |
| **Billing & Payments** | Direct active subscription creation without payment | Entitlement model (`FREE`, `STANDARD`, `PREMIUM`, `INSTITUTION`), payment provider abstraction (Razorpay/Stripe), webhook validation | **HIGH** |
| **Observability & Testing** | Zero automated tests, console.log logging | Vitest/Jest unit/integration tests, structured logger, request IDs, rate-limiting, OpenAPI docs | **HIGH** |

---

## 3. Recommended Refactoring Strategy

1. **Modular Monolith:** Retain single repository backend split cleanly into modular services (`src/modules/*` or `src/services/*`, `src/controllers/*`).
2. **Standard API Contracts:** Convert all routes to `/api/v1/*` returning standard success/error JSON envelopes.
3. **Database Schemas:** Standardize Mongoose models with validation, timestamps, compound indexes, and tenant context.
4. **Client Services:** Replace raw `fetch()` calls in React components with a typed `apiClient` service layer.
