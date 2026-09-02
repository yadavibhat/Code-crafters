# CampusOne Repository Foundation

CampusOne is a platform built with a React + TypeScript + Vite frontend, a thin FastAPI (Python) backend, and integrated with Databricks Free Edition for data and the Genie Agent.

---

## Architecture Overview

```
CampusOne/
├── .env.example
├── .gitignore
├── README.md
└── campusone/
    ├── backend/        # FastAPI Application
    │   ├── app/
    │   │   ├── core/
    │   │   ├── models/
    │   │   ├── routers/
    │   │   ├── services/
    │   │   └── genie_client/
    │   ├── .env.example
    │   └── requirements.txt
    └── frontend/       # React + TS + Vite Web Application
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── features/
        │   ├── hooks/
        │   ├── lib/
        │   ├── types/
        │   └── styles/
        └── .env.example
```

---

## Bootstrapping & Setup Commands

### Exact Bootstrap Commands Used

1. **Frontend Bootstrapping:**
   ```bash
   mkdir -p campusone && cd campusone
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

2. **Backend Bootstrapping:**
   ```bash
   mkdir -p campusone/backend/app/{routers,services,models,core,genie_client}
   python3 -m venv campusone/backend/.venv
   source campusone/backend/.venv/bin/activate
   pip install -r campusone/backend/requirements.txt
   ```

---

## Running Locally

### 1. Backend Service (FastAPI)

```bash
cd campusone/backend

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- Health Check: `http://127.0.0.1:8000/health` (Returns `200 OK` with `{"status": "ok"}`)

### 2. Frontend Service (Vite + React + TS)

```bash
cd campusone/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- Dev Server: `http://localhost:5173` (Fetches health endpoint and displays `backend: ok`)

---

## Environment Variables

Copy `.env.example` to `.env` in both root/backend and configure:

| Variable | Description |
|---|---|
| `DATABRICKS_HOST` | Host URL for Databricks workspace |
| `DATABRICKS_TOKEN` | Access Token for Databricks |
| `DATABRICKS_WAREHOUSE_ID` | SQL Warehouse ID |
| `DATABRICKS_GENIE_SPACE_ID` | Genie Agent Space ID |
| `SESSION_SECRET` | Secret key for session management |
| `ALLOWED_EMAIL_DOMAIN` | Email domain restriction |
| `VITE_API_BASE_URL` | Base URL of FastAPI backend (`http://localhost:8000`) |

---

## Verification & CI Commands

- **Backend Health Verification:**
  ```bash
  curl http://127.0.0.1:8000/health
  ```
- **Frontend Typecheck & Build:**
  ```bash
  cd campusone/frontend
  npm run build
  ```
