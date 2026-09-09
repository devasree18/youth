# YOUTH Platform — Production Deployment Guide

## Vercel Serverless Deployment Setup

The repository is configured for dual frontend static build + backend serverless deployment using `vercel.json`.

```json
{
  "version": 2,
  "builds": [
    { "src": "backend/src/server.ts", "use": "@vercel/node" },
    { "src": "frontend/package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/src/server.ts" },
    { "src": "/(.*)", "dest": "/frontend/index.html" }
  ]
}
```

### Production Checklist
1. Set `NODE_ENV=production` in Vercel project environment variables.
2. Set `MONGODB_URI` pointing to MongoDB Atlas cluster with connection pooling enabled.
3. Set `JWT_SECRET` to a 64-character random secret.
4. Set `ALLOWED_ORIGINS` to your production domain (e.g. `https://youthwellbeing.com`).
5. Run `npm run build` in both `backend` and `frontend` before deploying.
