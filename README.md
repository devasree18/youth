# Youth - Fullstack Application

A modern full-stack web application built with React, Vite, Express, and MongoDB.

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Firebase**: Client SDK for authentication/services

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Firebase**: Firebase Admin SDK
- **AI Integration**: Google GenAI
- **TypeScript**: Typed backend development

## Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Page components (Dashboard, Assessment, etc.)
│   │   └── App.tsx    # Main routing
│   └── package.json
├── backend/           # Express backend API
│   ├── src/
│   │   └── server.ts  # Express entry point
│   └── package.json
└── vercel.json        # Deployment configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Running Locally

1. **Install dependencies for both frontend and backend:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```

## Deployment
The project is configured for deployment on Vercel or similar platforms that support standard `vercel.json` configurations.
