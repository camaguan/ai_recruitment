# E-selector

An intelligent recruitment platform that automates candidate intake, parses and performs structured evaluations of CVs using artificial intelligence (Gemini API), and displays profiles with their respective Match Scores within a hiring pipeline.

## 🛠️ Tech Stack & Dependencies

- **Frontend/Backend**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL + Supabase Storage for CV PDF uploads)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (model `gemini-2.5-flash` with Structured Outputs)
- **Styling**: Tailwind CSS & Vanilla CSS (Minimalist / Swiss design aesthetic)
- **User Feedback**: Sonner (Toasts)

---

## 🏛️ Project Architecture

The project follows a clean architecture organized by layers and domain features:

```text
src/
├── app/                      # Routing and pages (Next.js App Router)
│   ├── api/                  # Backend endpoints
│   │   └── evaluate-cv/      # API Route to evaluate CVs with Gemini
│   ├── apply/                # Public job application form for candidates
│   ├── dashboard/            # Admin dashboard for recruiters
│   │   ├── candidates/       # Candidate management and details
│   │   ├── jobs/             # Job postings management
│   │   └── settings/         # Evaluation engine configuration
│   ├── layout.tsx            # Global layout
│   └── page.tsx              # Main landing page
├── components/               # Shared global UI components
├── features/                 # Domain-specific modules
│   ├── ai-evaluation/        # AI evaluation domain logic
│   ├── jobs/                 # Job vacancies domain logic
│   └── recruitment/          # Recruitment domain logic (e.g. UploadCvForm)
├── lib/                      # External service clients and utilities
│   └── supabase/             # Supabase client setup (client/admin)
```

---

## 🔄 Workflow & Processing

1. **Application**: The candidate submits their name, email, and CV (PDF) using the public job application form (`/apply/[jobId]`). The PDF is uploaded and stored in the `cv-uploads` bucket within Supabase Storage.
2. **Registration**: A record is created or updated in the `candidates` table and a corresponding application is linked in the `applications` table with the initial stage set to `cv_received`.
3. **AI Analysis**: From the candidate detail page, the recruiter clicks the **"Analizar con IA"** (Analyze with AI) button.
   - A POST request is sent to `/api/evaluate-cv` containing the `applicationId`.
   - The backend downloads the PDF, converts it to Base64, and passes it to the **Gemini API** along with the job details.
   - Gemini analyzes the CV and returns a structured JSON response containing:
     - `summary` (Professional summary)
     - `classification` (Seniority)
     - `riskLevel` (Risk Level: Low, Medium, High)
     - `suggestions` (Observations and alerts)
     - `score` (Role Match Score from 0 to 100)
4. **Storage & State Update**: The evaluation result is stored in the `ai_evaluations` table. The application record is updated with the calculated `score` and automatically transitions to the `human_review` stage.

---

## 🗄️ Database Schema (Supabase)

### `ai_evaluations` Table
```sql
create table public.ai_evaluations (
  id uuid not null default gen_random_uuid (),
  application_id uuid not null,
  raw_prompt text not null,
  model_used text not null,
  json_result jsonb not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint ai_evaluations_pkey primary key (id),
  constraint ai_evaluations_application_id_fkey foreign KEY (application_id) references applications (id) on delete CASCADE
) TABLESPACE pg_default;
```

---

## ⚙️ Environment Variables (`.env`)

Ensure you have the following environment variables set up in the root directory for the project to run correctly:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Gemini API Configuration
GEMINI_API_KEY=<your-gemini-api-key>
```

---

## 🚀 Running Locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view and interact with the application.
