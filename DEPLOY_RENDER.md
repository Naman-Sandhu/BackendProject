# Deploying to Render

This project deploys as two Render services:

- `movie-tickets-api`: Node/Express backend
- `movie-tickets-web`: Vite React static site

## Prerequisites

1. Push this repository to GitHub.
2. Create or use a MongoDB Atlas database.
3. In MongoDB Atlas Network Access, allow Render to connect. For a simple student/project deploy, allow `0.0.0.0/0`.

## Option A: Render Blueprint

1. In Render, choose **New > Blueprint**.
2. Select this GitHub repo.
3. Render will read `render.yaml`.
4. Fill the prompted secret values.

Backend environment variables:

```text
MONGO_URI=<your MongoDB Atlas connection string>
CLIENT_URL=https://movie-tickets-web.onrender.com
GOOGLE_CLIENT_ID=<optional Google OAuth client id>
GOOGLE_CLIENT_SECRET=<optional Google OAuth client secret>
GOOGLE_CALLBACK_URL=https://movie-tickets-api.onrender.com/api/auth/google/callback
```

Frontend environment variables:

```text
VITE_API_BASE_URL=https://movie-tickets-api.onrender.com
```

`JWT_SECRET` is generated automatically by the blueprint.

## Option B: Manual Services

Create the backend first:

```text
Service type: Web Service
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Add backend environment variables:

```text
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any long random secret>
CLIENT_URL=<your frontend Render URL after frontend is created>
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
GOOGLE_CALLBACK_URL=https://<your-backend-service>.onrender.com/api/auth/google/callback
```

Create the frontend second:

```text
Service type: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Add frontend environment variables:

```text
VITE_API_BASE_URL=https://<your-backend-service>.onrender.com
```

Add this rewrite rule for React Router:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

After both services exist, update backend `CLIENT_URL` to the real frontend URL and redeploy the backend.

## Seed Movies

After the backend deploys, open the backend service Shell on Render and run:

```sh
npm run seed
```

This inserts the sample movies used by the app.

## Notes

- Uploaded profile images use local disk storage. On Render's free web service filesystem, uploads are not durable across deploys/restarts. Use a persistent disk or cloud storage for production uploads.
- Google login works only after you set the Google OAuth callback URL to the deployed backend callback URL.
