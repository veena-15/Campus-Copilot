# Campus Copilot

Campus Copilot is a student success workspace built with Next.js, TypeScript, Supabase Auth/Postgres, and a separate FastAPI backend. It includes attendance and performance tracking, assignments, study planning, and an AI tutor using Navigate Labs.

## Run the frontend and backend separately

Use two terminals from the repository root.

**Terminal 1 — FastAPI with Uvicorn** (Python 3.11 or newer):

```powershell
py -m venv backend/.venv
.\backend\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
.\backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Edit `backend/.env` before starting Uvicorn. The conditional copy preserves your existing backend settings.
The API health endpoint is `http://localhost:8000/health`, and its interactive docs are at `http://localhost:8000/docs`.

**Terminal 2 — Next.js frontend:**

```powershell
npm install
npm run dev
```

Open http://localhost:3000. The browser uses `NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:8000`) for the API.

## Configure services

Add your Supabase browser settings to the root `.env.local` file. The sign-in screen requires these values before authentication can work:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Add the matching Supabase URL and publishable key, and your Navigate Labs values, to `backend/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NAVIGATE_API_URL=
NAVIGATE_API_KEY=
NAVIGATE_MODEL=
BACKEND_CORS_ORIGINS=http://localhost:3000
```

Use actual values from your accounts. Keep `.env.local` and `backend/.env` out of source control. Restart both processes after changing environment settings.

## Supabase setup

1. Create or select a Supabase project.
2. In its SQL Editor, run the complete `supabase/schema.sql` file. This creates `student_workspaces` and its owner-only Row Level Security policy.
3. Enable Email in Supabase Authentication → Providers. Configure email delivery and confirmation for production.
4. Add the project URL and publishable key to both env files as above.
5. Start the backend and frontend, create an account, and sign in.

The browser uses Supabase Auth. FastAPI verifies each bearer token and queries with that same token, so Postgres Row Level Security scopes records to the signed-in user. The app does not use a service-role key. AI prompts, study plans, and material extraction are handled by FastAPI; Navigate Labs keys remain server-side in `backend/.env`.

## Deploy the backend to Vercel

The backend is a FastAPI application and can be deployed as its own Vercel project from this repository. Vercel detects `backend/main.py` as the FastAPI entry point when you set the project's Root Directory to `backend`; no Uvicorn start command or custom build command is needed. Uvicorn is only for local development.

1. In Vercel, create a **New Project** and import this same Git repository.
2. In project setup, set **Root Directory** to `backend`. Leave the framework/build settings on automatic detection; do not enter a start command.
3. Add these environment variables to the backend project for **Production** (and Preview too, if you use preview deployments):

   ```env
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
   NAVIGATE_API_URL=YOUR_PROVIDER_CHAT_COMPLETIONS_URL
   NAVIGATE_API_KEY=YOUR_NAVIGATE_KEY
   NAVIGATE_MODEL=YOUR_MODEL_NAME
   BACKEND_CORS_ORIGINS=https://YOUR_DEPLOYED_FRONTEND_DOMAIN
   ```

   Use the full chat-completions URL supplied by Navigate Labs. Keep both provider and Supabase credentials in Vercel's backend environment settings; never add them to source code or a `NEXT_PUBLIC_` variable.
4. Deploy. The backend's root URL `/health` should return a healthy status. Its API endpoints include `/api/workspace`, `/api/chat`, `/api/plan`, and `/api/materials`.
5. Copy the backend deployment's HTTPS origin (for example, `https://your-backend.vercel.app`). In the **frontend Vercel project**, set `NEXT_PUBLIC_BACKEND_URL` to that origin for the relevant environments, then redeploy the frontend. Do not add a trailing path such as `/api` to this value.
6. In Supabase Authentication settings, set the production frontend URL as the Site URL and add its sign-in callback URL to the allowed redirect URLs.

The backend writes workspace data only to the Supabase PostgreSQL database, using the signed-in user's access token and the `student_workspaces` table's Row Level Security policy. The `data` column is PostgreSQL `jsonb`; there is no SQLite file or in-memory database. The current `supabase/schema.sql` is the database setup for this app. If you already ran it successfully in the same Supabase project, you do not need to run it again for this backend deployment.

Vercel runs FastAPI as a function, not as a continuously running Uvicorn server. Uploaded PDF/TXT files are limited to 3 MB so the multipart request remains under Vercel Functions' 4.5 MB request-body cap.

## Project layout

```text
app/       Next.js frontend and auth UI
backend/   FastAPI app, Uvicorn service, and Python dependencies
lib/       Frontend calculation and Supabase client helpers
supabase/  Database schema and row-level security policies
```

## Checks

```powershell
npm run typecheck
npm run lint
npm run build
```
