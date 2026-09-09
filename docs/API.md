# YOUTH Platform — OpenAPI API Reference Document

**API Version:** `v1`  
**Base Path:** `/api/v1`  

---

## 1. Standard Response Envelope

All API endpoints return JSON responses adhering to this standard structure:

### Success Response Format (HTTP 200/201)
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "meta": {
    "requestId": "c9a401b3-4f92-4f11-827c-38d5e89a2a91",
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response Format (HTTP 400/401/403/404/409/500)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid parameter provided",
    "details": {
      "email": ["Invalid email address"]
    }
  },
  "meta": {
    "requestId": "c9a401b3-4f92-4f11-827c-38d5e89a2a91"
  }
}
```

---

## 2. Core Endpoints Summary

| Category | Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- |
| **Auth** | `/api/v1/auth/register` | POST | No | Registers new user account with role assignment |
| **Auth** | `/api/v1/auth/login` | POST | No | Authenticates user and sets HttpOnly cookie |
| **Auth** | `/api/v1/auth/me` | GET | Yes | Retrieves current user profile and permissions |
| **Wellbeing** | `/api/v1/mood` | POST | Yes | Records persistent mood check-in (1-5 scale) |
| **Wellbeing** | `/api/v1/wellbeing/summary` | GET | Yes | Returns dynamic calculated wellbeing score |
| **Assessment** | `/api/v1/assessment/templates` | GET | No | Returns schema-driven assessment templates |
| **Assessment** | `/api/v1/assessment/submit` | POST | Yes | Submits assessment answers and computes score |
| **Crisis** | `/api/v1/crisis/resources` | GET | No | Returns emergency helpline directory |
| **Crisis** | `/api/v1/crisis/evaluate` | POST | No | Evaluates input text for crisis signals |
| **AI** | `/api/v1/ai/chat` | POST | Yes | Processes safe AI chat with crisis interceptor |
| **Community** | `/api/v1/community/posts` | GET/POST | GET: No, POST: Yes | Pseudonymous community discussion board |
| **Counselors** | `/api/v1/counselors` | GET | No | Returns verified counselor marketplace |
| **Appointments**| `/api/v1/appointments/book` | POST | Yes | Transaction-safe slot booking |
| **Institution** | `/api/v1/institution/stats` | GET | Yes (Role: Inst Admin) | Scoped campus analytics (privacy suppressed) |
| **Subscriptions**| `/api/v1/subscriptions/plans` | GET | No | Lists subscription tiers and limits |
| **Subscriptions**| `/api/v1/subscriptions/create-order` | POST | Yes | Initializes payment gateway checkout order |
| **Admin** | `/api/v1/admin/stats` | GET | Yes (Role: Admin) | System-wide admin metrics |
