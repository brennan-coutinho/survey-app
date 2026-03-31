# survey-app 
Developer Survey App    
A full-stack web application that collects developer survey responses and displays real-time aggregate results. Built with React, Express, and Supabase.

Description
The Developer Survey App presents users with a short form capturing their name, experience level, how they discovered the platform, and their areas of interest. After submitting, respondents are taken to a personalised results page that shows their own answers alongside live summary statistics — total submissions and proportional breakdowns across all three categorical fields.

Features
Survey form with four field types: text input, radio buttons, dropdown, and checkboxes
Real-time results page showing the submitter's answers immediately after submission
Aggregate summary with proportional bar charts for experience level, referral source, and interests
Live response count fetched directly from Supabase on every page load
Form validation — all fields required, interests require at least one selection
Persistent storage — responses are saved to a Supabase PostgreSQL table with array support for multi-select interests
Clean, responsive UI built with shadcn/ui and Tailwind CSS (light and dark palette)
Tech Stack
Layer	Technology
Frontend framework	React 18 + Vite
Routing	Wouter
Forms	React Hook Form + Zod
Data fetching	TanStack React Query
UI components	shadcn/ui (Radix UI primitives)
Styling	Tailwind CSS v4
Backend framework	Express 5 (Node.js)
Database	Supabase (PostgreSQL)
API contract	OpenAPI 3.1 spec
Code generation	Orval (React Query hooks + Zod schemas)
Language	TypeScript (strict)
Package manager	pnpm workspaces
Getting Started
Prerequisites
Node.js 24+
pnpm 10+
A Supabase project with the survey_responses table (see Database Setup)
Environment Variables
Set the following as environment secrets (not plain env vars):

Variable	Description
SUPABASE_URL	Your Supabase project URL, e.g. https://xxxx.supabase.co
SUPABASE_ANON_KEY	Your Supabase project anon/public key
Install Dependencies
pnpm install
Run in Development
The project runs two services in parallel:

API server (Express):

pnpm --filter @workspace/api-server run dev
Frontend (Vite dev server):

pnpm --filter @workspace/survey-app run dev
The frontend is served at http://localhost:<PORT>/ and the API at http://localhost:<API_PORT>/api.

Build for Production
pnpm run build
Database Setup
Create the survey_responses table in your Supabase project by running the following SQL in the Supabase SQL editor:

CREATE TABLE IF NOT EXISTS survey_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  experience  TEXT NOT NULL,
  referral    TEXT NOT NULL,
  interests   TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Allow public (anon) reads and writes for survey submissions
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
If you prefer to keep RLS enabled, add explicit INSERT and SELECT policies for the anon role instead.

API Endpoints
All routes are prefixed with /api.

Method	Path	Description
GET	/api/health	Server health check
POST	/api/survey-responses	Submit a new survey response
GET	/api/survey-responses	Fetch all responses (newest first)
GET	/api/survey-responses/summary	Aggregate totals and breakdowns
POST /api/survey-responses — Request body
{
  "name": "Jane Smith",
  "experience": "intermediate",
  "referral": "friend",
  "interests": ["frontend", "design"]
}
Valid values:

experience: beginner | intermediate | advanced
referral: friend | social_media | search | other
interests: any combination of frontend | backend | design | devops
Project Structure
.
├── artifacts/
│   ├── api-server/             # Express 5 API server
│   │   └── src/
│   │       ├── app.ts          # Express app setup (CORS, JSON, routes)
│   │       ├── index.ts        # Entry point — starts server, verifies DB
│   │       ├── lib/
│   │       │   ├── logger.ts   # Pino structured logger
│   │       │   └── supabase.ts # Supabase client
│   │       └── routes/
│   │           ├── health.ts   # GET /health
│   │           ├── survey.ts   # Survey CRUD routes
│   │           └── index.ts    # Route aggregator
│   └── survey-app/             # React + Vite frontend
│       └── src/
│           ├── App.tsx         # Root component + wouter router
│           ├── index.css       # Tailwind theme (CSS custom properties)
│           ├── pages/
│           │   ├── survey-form.tsx   # Survey form page (/)
│           │   └── results.tsx       # Results + summary page (/results)
│           └── components/ui/  # shadcn/ui component library
├── lib/
│   ├── api-spec/               # OpenAPI 3.1 spec + Orval codegen config
│   │   └── openapi.yaml
│   ├── api-zod/                # Generated Zod validation schemas
│   └── api-client-react/       # Generated TanStack React Query hooks
├── replit.md                   # Developer notes and architecture docs
├── pnpm-workspace.yaml
└── README.md
Author
Brennan — University of Iowa
