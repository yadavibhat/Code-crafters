# CampusOne Deployment & Reproduction Guide (DEPLOY.md)

This guide provides exact, copy-pasteable instructions for a judge, evaluator, or teammate to set up and run the complete **CampusOne** stack (Databricks Free Edition / Local SQL, FastAPI backend, and React TypeScript frontend) from zero in **under 20 minutes**.

---

## 1. System Requirements & Environment Setup

- **Node.js**: `v18.x` or later (`node -v`)
- **Python**: `v3.10` or later (`python3 --version`)
- **Git**: `git --version`

### Clone the Repository
```bash
git clone https://github.com/yadavibhat/Code-crafters.git
cd Code-crafters/campusone
```

---

## 2. Backend Setup (FastAPI & Databricks / SQLite Layer)

### Create Virtual Environment & Install Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Environment Configuration (`.env`)
Create `backend/.env` based on `.env.example`:
```env
DATABRICKS_HOST=https://community.cloud.databricks.com
DATABRICKS_TOKEN=your_databricks_pat_token_here
DATABRICKS_WAREHOUSE_ID=your_sql_warehouse_id_here
DATABRICKS_GENIE_SPACE_ID=14167300275364273832
SESSION_SECRET=campusone_secret_key_2026
ALLOWED_EMAIL_DOMAIN=nitte.edu.in
```
> *Note: If Databricks environment variables are omitted, CampusOne automatically falls back to an embedded SQLite engine pre-seeded with all NMIT verified tables and 80 synthetic student profiles.*

### Seed Database & Generate Views
Run the single reproduction script to seed Delta tables, Unity Catalog views, NMIT alumni records, and synthetic profiles:
```bash
python3 scripts/seed_data.py
```

### Run FastAPI Backend Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Verify health endpoint at: `http://127.0.0.1:8000/health` (Returns `{"status": "ok"}`).

---

## 3. Frontend Setup (React + TypeScript + Vite)

Open a new terminal window:
```bash
cd campusone/frontend
npm install
```

### Environment Configuration (`.env`)
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Run Vite Development Server
```bash
npm run dev -- --port 5173
```
Access the CampusOne Web App live at: `http://localhost:5173`

---

## 4. Production Build Verification
To test production TypeScript compilation and asset bundling:
```bash
cd campusone/frontend
npm run build
```

---

## 5. Databricks Free Edition One-Script Setup

To deploy on a fresh **Databricks Free Edition Workspace**:
1. Copy `backend/scripts/schema.sql` into Databricks SQL Query Editor and click **Run All**.
2. Copy `backend/scripts/genie_instructions.md` into your Databricks Genie Space Instructions box.
3. Run `python3 backend/scripts/seed_data.py` to populate Unity Catalog `campusone.core`.
