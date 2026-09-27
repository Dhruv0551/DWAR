# D.W.A.R — Digital Window for Approval and Registration
**Smart India Hackathon 2026** · *Team Missing Semi-Colon*

An intelligent approval orchestration platform converting fragmented industrial clearances in Maharashtra into a personalized, guided journey.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher) & `npm`
- **Python** (v3.10 or higher) & `pip`
- *(Optional)* Supabase project & Groq API key for live authentication and live AI advisor.

---

### Step 1: Environment Setup
Copy the template environment file:
```bash
cp .env.example .env
```
Open `.env` in any text editor and fill in your values:
- `SUPABASE_URL` & `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://xyz.supabase.co`)
- `SUPABASE_ANON_KEY` & `VITE_SUPABASE_ANON_KEY`: Your Supabase public anonymous key
- `GROQ_API_KEY`: *(Optional)* Your Groq API key for the live AI clearance advisor
- `GROQ_MODEL`: `openai/gpt-oss-20b`

> **Note:** If you don't provide Groq keys or Supabase credentials, the platform includes built-in offline demo fallbacks so the approval engine remains fully testable.

---

### Step 2: Start the Backend (Django)
In your terminal:
```bash
# 1. (Recommended) Create and activate a Python virtual environment
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On macOS / Linux:
source .venv/bin/activate

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Navigate to backend and run database migrations
cd backend
python manage.py migrate

# 4. Start the Django development server
python manage.py runserver
```
*Backend will run at:* `http://127.0.0.1:8000/`

---

### Step 3: Start the Frontend (Vite + React)
In a **new terminal window** at the project root directory:
```bash
# 1. Install frontend dependencies
npm install

# 2. Launch Vite development server
npm run dev
```
*Frontend will run at:* `http://localhost:5173/`

---

## 📦 What's Included
1. **Interactive Maharashtra Industrial Onboarding Wizard**:
   - Sector selection (Food, Textiles, EV/Auto, Pharma, Chemicals, etc.)
   - Scale & investment configuration in ₹ Lakhs + MIDC zone mapping
   - Operational parameters (MPCB environmental classification, power load, land readiness)
2. **Personalized Dynamic Approval Roadmap**:
   - Automated sequencing of clearances (MIDC Land, Building Plan, Fire NOC, Factory Licence, MPCB Consent to Establish)
   - Critical path timeline analysis & dependency blocking logic
3. **AI Approval Advisor Widget**:
   - Scoped specifically to Maharashtra industrial regulations, policy schemes, and approvals
4. **Document Management Microservice**:
   - Direct file upload, validation, and multi-agency reuse tracking
5. **Government Incentive Discovery**:
   - Automatic matching with Maharashtra Industrial Policy 2025 schemes and capital subsidies
