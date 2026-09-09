# YOUTH Platform — Vercel Production Deployment Guide

## 1. Vercel Serverless Architecture

YOUTH is configured for seamless deployment on Vercel as a dual-tier serverless project:
- **Backend API:** Managed via `@vercel/node` (`backend/src/server.ts`) handling all `/api/(.*)` and `/api/v1/(.*)` endpoints.
- **Frontend SPA:** Managed via `@vercel/static-build` compiling the React 19 Vite application (`frontend/dist/`).

---

## 2. Vercel Environment Variables Configuration Checklist

Navigate to your Vercel Project Dashboard:  
👉 **Project Settings ➔ Environment Variables**

Add the following environment variables (select **Production**, **Preview**, and **Development**):

| Key | Example / Format | Description |
| --- | --- | --- |
| `NODE_ENV` | `production` | Production environment mode |
| `MONGODB_URI` | `mongodb+srv://<db_user>:<db_pass>@cluster.mongodb.net/youth_db` | Production MongoDB Atlas connection string |
| `MONGODB_USERNAME` | `<YOUR_MONGODB_USERNAME>` | Database username |
| `MONGODB_PASSWORD` | `<YOUR_MONGODB_PASSWORD>` | Database user password |
| `JWT_SECRET` | `<YOUR_64_BYTE_JWT_SECRET>` | 64-byte random JWT secret |
| `GEMINI_API_KEY` | `<YOUR_GEMINI_API_KEY>` | Google Gemini AI API key |
| `ALLOWED_ORIGINS` | `https://your-vercel-deployment.vercel.app` | Allowed CORS origins for Vercel production domain |

---

## 3. Redeploying on Vercel

After adding or updating these environment variables in your Vercel Dashboard:
1. Go to **Deployments** tab in Vercel.
2. Select the latest deployment, click **...** (Options) ➔ **Redeploy**.
3. Select **Redeploy with un-cached build**.
