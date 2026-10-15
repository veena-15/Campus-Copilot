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

## Deployment

Deploy Next.js and FastAPI as separate services. Set `NEXT_PUBLIC_BACKEND_URL` to the deployed HTTPS API origin in the frontend's build environment. Set `BACKEND_CORS_ORIGINS` to the exact deployed frontend origin(s). Add Supabase and Navigate Labs settings to the backend's environment. Configure the Supabase Auth Site URL and redirect URLs for the deployed frontend, then apply `supabase/schema.sql` to the production project.

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
