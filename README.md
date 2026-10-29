# AI Hiring Platform (MVP)

An AI-powered hiring platform that connects recruiters and job seekers. It parses resumes, matches candidates to jobs, runs and scores recorded interviews, flags fraud risk, and combines everything into a single candidate score (ATP) so recruiters can shortlist faster and job seekers get objective feedback.

**Intended use:** an early-stage MVP for recruiting teams and job seekers; a starting point to extend, not a finished production product.

## Features

- **Resume parsing and matching:** upload a PDF resume, extract structured data with AI, and match candidates to jobs using vector search
- **AI interviews:** record answers, transcribe them (AssemblyAI), and score domain knowledge, communication and behaviour
- **ATP score and passport:** a weighted candidate score with a per-user "passport" page
- **Fraud detection:** a risk score that feeds into the candidate's overall rating
- **Recruiter tools:** post jobs, search candidates, export/import via ATS endpoints, view analytics
- **Video meetings:** live rooms (Agora) with an AI overlay
- **Credits and billing:** credit-based usage for AI actions

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase (auth, Postgres, pgvector), OpenAI-compatible API, AssemblyAI, Agora, Recharts.

## Getting started

```bash
git clone https://github.com/perfectalone375/MVP.git
cd MVP
npm install
cp .env.example .env.local   # then fill in your own keys
```

1. Create a Supabase project and run the SQL files in `supabase/` in this order: `schema.sql`, `match_resumes.sql`, `credits.sql`, `billing.sql`, `update_atp.sql`.
2. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

Optional: `npx tsx scripts/seed.ts` to load sample data.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel and Docker (Fly.io / Render) instructions.

## Project structure

```
src/app/          Pages and API routes (App Router)
src/components/   UI and feature components
src/lib/          Supabase clients, AI helpers (resume, interview, matching, ATP)
supabase/         Database schema and SQL functions
scripts/          Seed script
```

## Security

Never commit real keys. Use `.env.local` for secrets (it is git-ignored) and only keep placeholders in `.env.example`.

## License

Released under the [MIT License](LICENSE).
