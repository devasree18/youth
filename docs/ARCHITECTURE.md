# YOUTH Platform — Architecture & System Design Document

## 1. Architectural Overview

YOUTH is designed as a **Modular Monolith** engineered for progressive enterprise scale. The codebase avoids premature microservice fragmentation while ensuring strict module boundaries, tenant isolation, and stateless REST API handlers.

```text
                               ┌────────────────────────────────┐
                               │     React 19 Frontend App      │
                               │  (Vite + Tailwind + Framer)    │
                               └───────────────┬────────────────┘
                                               │ HTTPS / JSON Envelope
                                               ▼
                               ┌────────────────────────────────┐
                               │   Express REST API Engine      │
                               │        (/api/v1/*)             │
                               └───────────────┬────────────────┘
                                               │
      ┌──────────────────┬─────────────────────┼─────────────────────┬──────────────────┐
      ▼                  ▼                     ▼                     ▼                  ▼
┌──────────────┐ ┌───────────────┐   ┌──────────────────┐  ┌──────────────────┐ ┌─────────────┐
│ Auth & RBAC  │ │ Multi-Tenancy │   │ Core Wellbeing   │  │ Crisis & AI      │ │ Monetization│
│  Module      │ │   Module      │   │ & Scoring Engine │  │ Safety Classifier│ │  & Gateway  │
└──────────────┘ └───────────────┘   └──────────────────┘  └──────────────────┘ └─────────────┘
      │                  │                     │                     │                  │
      └──────────────────┴─────────────────────┼─────────────────────┴──────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │        MongoDB Database        │
                               │    (Tenant-Scoped Schemas)     │
                               └────────────────────────────────┘
```

---

## 2. Core Domain Modules

1. **Auth & RBAC Module (`src/routes/auth.ts`, `src/middleware/rbac.ts`)**
   - Handles password hashing via bcrypt, JWT issuance, HttpOnly cookies, and granular permission checking (`users.read`, `system.manage`, etc.).

2. **Multi-Tenancy Engine (`src/models/Tenant.ts`, `src/models/Institution.ts`)**
   - Scopes data queries using `tenantId` and `institutionId`. Enforces aggregate privacy thresholds (e.g. suppression when student count < 5).

3. **Core Wellbeing & Dynamic Scoring Engine (`src/services/WellbeingService.ts`)**
   - Computes real-time dynamic wellbeing scores (0-100) combining persistent mood check-ins (40% weight) and schema-driven assessment scores (60% weight).

4. **Crisis-Safety & AI Engine (`src/services/CrisisService.ts`, `src/services/AIService.ts`)**
   - Pre-evaluates inputs for self-harm keywords and intercepts crisis signals with immediate emergency helpline resources (Tele-MANAS, KIRAN, Vandrevala). Provides server-side Gemini/OpenAI provider abstraction with fallback handling.

5. **Counselor Marketplace & Booking Engine (`src/models/Appointment.ts`)**
   - Transaction-safe slot booking with database unique compound index (`counselorId + scheduledAt`) preventing double bookings.

6. **Monetization & Entitlement Engine (`src/services/EntitlementService.ts`, `src/services/PaymentService.ts`)**
   - Server-side entitlement checks (`FREE`, `STANDARD`, `PREMIUM`, `INSTITUTION`), order creation, and signed webhook verification.
