# YOUTH Platform — Security & Privacy Policy Architecture

## 1. Security Rules & Implementation Summary

1. **Zero Secret Fallbacks (`SEC-001`):**
   - Hardcoded fallback secrets are completely removed. Server throws a fatal error on startup if `JWT_SECRET` is missing in production.

2. **CORS Hardening (`SEC-002`):**
   - CORS is restricted using `ALLOWED_ORIGINS` environment configuration. Wildcard origins (`*`) are disallowed in production.

3. **Session & Cookie Security (`SEC-003`):**
   - JWT tokens are issued via secure, `HttpOnly`, `SameSite=lax` cookies. Access tokens stored in client `localStorage` are checked via `/api/v1/auth/me`.

4. **Crisis-Safety Interceptor (`CRISIS-001`):**
   - Server-side pre-evaluator scans incoming text for self-harm signals. Intercepted messages immediately return 24/7 hotline helpline resources (Tele-MANAS 14416, KIRAN 1800-599-0019, Vandrevala +91 9999 666 555).

5. **Granular RBAC Authorization:**
   - Authorization is enforced on every endpoint using `requireRole()` and `requirePermission()`. UI guards are treated as visual aids only.

6. **Rate Limiting & Request Tracking:**
   - Express rate limiting (`express-rate-limit`) limits requests to 300 per 15-minute window per IP. Unique `X-Request-ID` headers are injected into every request log.
