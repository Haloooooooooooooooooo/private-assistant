# Private Assistant

Workflow-orchestrated multi-agent personal knowledge internalization system.

## Phase 0

This baseline contains:

1. `frontend/`: Next.js + TypeScript app shell.
2. `backend/`: FastAPI app shell.
3. Environment examples for frontend and backend.
4. `/health` backend endpoint with Supabase configuration and connectivity diagnostics.

## Run Locally

Backend:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.
