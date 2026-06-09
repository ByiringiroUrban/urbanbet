# UrbanBet

Sports betting and casino UI (Vite + React + TypeScript), with an optional Django REST API in `backend/`.

## Prerequisites

- **Node.js** 18+ (for the frontend)
- **Python** 3.11+ (only if you run the API)
- **PostgreSQL** (only if you run the API; default database name is `urbanbet_db`)

---

## Run the frontend (main app)

From the repository root:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app at **http://localhost:8080** (port is set in `vite.config.ts`).

### Other frontend commands

| Command        | Purpose                    |
|----------------|----------------------------|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Run the backend API (optional)

Use this when you need the Django REST API and database.

1. **Create a PostgreSQL database** (for example `urbanbet_db`) and note host, port, user, and password.

2. **Configure environment variables** in `backend/`:

   - Copy `backend/.env.example` to `backend/.env`.
   - Set `DATABASE_URL` so it matches your database. The app reads a single URL, for example:

     ```
     DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/urbanbet_db
     ```

   - **CORS:** The Vite dev server uses **http://localhost:8080**. Add it to `CORS_ALLOWED_ORIGINS` in `.env` (comma-separated), for example:

     ```
     CORS_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,http://localhost:3000
     ```

3. **Python virtual environment and dependencies** (from `backend/`):

   ```bash
   cd backend
   python -m venv venv
   ```

   **Windows (PowerShell):**

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   **macOS / Linux:**

   ```bash
   source venv/bin/activate
   ```

   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations and run the server:**

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

   The API is typically at **http://127.0.0.1:8000/** (adjust if you use another host/port).

If `psql` or database creation fails on your machine, create the database with pgAdmin or another GUI, then run `migrate` and `runserver` as above.
