# Deployment Configuration

## Environment Variables (Production)

Copy these to your Vercel project settings or `.env.production`.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key-or-openrouter-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1 # If using OpenRouter

# AssemblyAI
ASSEMBLYAI_API_KEY=your-assemblyai-key

# Agora (Video)
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Build Settings (Vercel)

- **Framework Preset**: Next.js
- **Root Directory**: `.` (Root)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Docker Deployment (Fly.io / Render)

1. Build the image:
   ```bash
   docker build -t ai-hiring-platform .
   ```
2. Run container:
   ```bash
   docker run -p 3000:3000 --env-file .env.local ai-hiring-platform
   ```

## Database Migrations

Run the SQL files in `supabase/` in the following order:
1. `schema.sql` (Core tables and RLS)
2. `billing.sql` (Credits and Tiers)
3. `credits.sql` (Credit deduction logic)
4. `update_atp.sql` (ATP logic)

## Seed Data

Run the seed script to populate test users and jobs:
```bash
npm install -g ts-node
ts-node scripts/seed.ts
```
