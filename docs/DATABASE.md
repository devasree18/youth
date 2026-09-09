# YOUTH Platform — Database & Schema Design Document

## 1. Mongoose Models Overview

| Model | File Path | Key Indexes & Constraints | Purpose |
| --- | --- | --- | --- |
| **User** | `src/models/User.ts` | `email` (unique), `{ tenantId: 1, role: 1 }` | User account credentials, roles, permissions, multi-tenant IDs |
| **Tenant** | `src/models/Tenant.ts` | `slug` (unique) | Multi-tenant organization boundaries |
| **Institution** | `src/models/Institution.ts` | `code` (unique), `tenantId` | Educational institution B2B entity |
| **Membership** | `src/models/Membership.ts` | `{ userId: 1, tenantId: 1 }` (unique) | User-tenant membership mapping |
| **MoodEntry** | `src/models/MoodEntry.ts` | `{ userId: 1, createdAt: -1 }` | Historical mood check-ins (1-5 numeric scale) |
| **AssessmentTemplate** | `src/models/Assessment.ts` | `code` (unique) | Schema-driven assessment question definitions |
| **AssessmentResult**| `src/models/AssessmentResult.ts` | `{ userId: 1, createdAt: -1 }` | Reproducible assessment scores & recommendations |
| **Conversation** | `src/models/Conversation.ts` | `{ userId: 1, updatedAt: -1 }` | AI assistant chat history & safety flags |
| **Post** | `src/models/Post.ts` | `{ status: 1, createdAt: -1 }` | Pseudonymous community discussion posts |
| **Comment** | `src/models/Comment.ts` | `{ postId: 1, status: 1 }` | Discussion comments |
| **Report** | `src/models/Report.ts` | `{ targetId: 1, status: 1 }` | Content abuse & self-harm reports |
| **Counselor** | `src/models/Counselor.ts` | `specialization`, `verificationStatus` | Counselor profile & availability slots |
| **Appointment** | `src/models/Appointment.ts` | `{ counselorId: 1, scheduledAt: 1 }` (unique) | Transaction-safe booking slot lock |
| **Plan** | `src/models/Plan.ts` | `code` (unique) | Subscription tiers & feature limits |
| **Subscription** | `src/models/Subscription.ts` | `{ userId: 1, status: 1 }` | Active user subscription state |
| **Payment** | `src/models/Payment.ts` | `providerOrderId` (index) | Payment transaction log & signatures |
| **AuditLog** | `src/models/AuditLog.ts` | `{ createdAt: -1 }`, `action` | Security audit trail |
| **FeatureFlag** | `src/models/FeatureFlag.ts` | `key` (unique) | System feature toggles |

---

## 2. Multi-Tenancy & Privacy Suppression Rule

Every tenant-sensitive document includes `tenantId` or `institutionId`. For institution analytics queries, queries are scoped to `tenantId`. If `activeStudents < 5`, individual details are suppressed and `anonymized: true` is returned.
