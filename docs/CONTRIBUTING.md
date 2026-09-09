# YOUTH Platform — Engineering Contributing Guidelines

## Code Guidelines
- Write TypeScript strictly without using `any`.
- Never put business logic or database queries inside UI components. Use `apiClient` and backend domain services.
- Never commit `.env` files, secrets, or compiled JS artifacts in `src/`.

## Testing Rules
- Every new API endpoint must include automated tests in `backend/tests/`.
- Run `npm test` before opening any PR.
- Verify `npm run build` passes cleanly in both `backend` and `frontend`.
