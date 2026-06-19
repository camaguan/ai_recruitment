# e-Selector
**Intelligent AI-Powered Recruitment & Selection Platform**

e-Selector is a modern, high-performance recruitment platform designed to streamline candidate intake and automate resume evaluations. Powered by advanced artificial intelligence, it provides recruiting teams with structured insights, compatibility mapping, and an intuitive dashboard to manage the hiring pipeline.

---

## ✨ Key Features

* **Instant AI Evaluation**: Automatically parses PDF resumes using the Gemini API to extract key professional experience, skills, and insights.
* **Match Scoring**: Calculates an objective alignment score (0-100) to help recruiters identify top candidates instantly.
* **Smart Risk & Seniority Profiling**: Categorizes applicants by seniority levels and identifies potential hiring considerations or career gaps.
* **Unified Recruiter Dashboard**: A clean, minimalist interface for tracking applicants, reviewing AI suggestions, and managing candidate stages in real-time.
* **Seamless Document Viewer**: View the candidate's original PDF resume side-by-side with AI-generated insights.

---

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

## 🔄 How it Works

1. **Candidate Application**: Applicants apply directly through a tailored vacancy page, uploading their resume securely.
2. **AI-Assisted Analysis**: With a single click, recruiters trigger a deep-analysis of the resume relative to the specific job description.
3. **Structured Insights**: The platform extracts key insights, flags potential alignment risks, assigns a compatibility score, and advances the candidate in the review pipeline.
4. **Human Final Review**: Recruiting teams make final decisions equipped with objective metrics, reducing time-to-hire.

---

## 🛠️ Technology Highlights

* **Frontend & Backend**: Next.js (App Router, React 19)
* **AI Engine**: Google Gemini API (`gemini-2.5-flash` with Structured JSON Schema output)
* **Database & Document Storage**: Supabase (PostgreSQL & Secure Storage buckets)
* **Design & UX**: Responsive Swiss-inspired minimalist design

---

## ⚙️ Setup & Configuration

To run the platform locally, configure the following environment variables in a `.env` file in the root directory:

```env
# Supabase Services
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Google Gemini API
GEMINI_API_KEY=<your-gemini-api-key>
```

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
