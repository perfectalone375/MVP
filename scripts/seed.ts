
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
})

async function generateEmbedding(text: string) {
    try {
        const res = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        })
        return res.data[0].embedding
    } catch (e) {
        console.warn('OpenAI embedding failed, using zero vector for seed')
        return new Array(1536).fill(0)
    }
}

async function seed() {
    console.log('🌱 Starting seed...')

    // 1. Create Recruiter User
    const recruiterEmail = 'recruiter@demo.com'
    const { data: recAuth, error: recErr } = await supabase.auth.admin.createUser({
        email: recruiterEmail,
        password: 'password123',
        email_confirm: true,
        user_metadata: { role: 'recruiter' }
    })

    if (recErr) console.log(`Recruiter creation msg: ${recErr.message}`)
    else console.log(`Created Recruiter: ${recruiterEmail} (${recAuth.user.id})`)

    const recruiterId = recAuth.user?.id || (await supabase.from('users').select('id').eq('email', recruiterEmail).single()).data?.id

    if (recruiterId) {
        // Ensure profile exists (trigger might have handled it, but let's be safe/update it)
        await supabase.from('users').upsert({
            id: recruiterId,
            email: recruiterEmail,
            role: 'recruiter',
            credits: 100,
            tier: 'pro'
        })

        // 2. Post a sample Job
        const jobTitle = 'Senior Frontend Engineer'
        const jobDesc = 'We are looking for a React expert with Next.js experience.'
        const embedding = await generateEmbedding(`${jobTitle} ${jobDesc}`)

        await supabase.from('jobs').insert({
            recruiter_id: recruiterId,
            title: jobTitle,
            description: jobDesc,
            requirements: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
            location: 'Remote',
            salary_range: '$120k - $160k',
            embedding: embedding
        })
        console.log('Created Sample Job')
    }

    // 3. Create Candidate User
    const candidateEmail = 'candidate@demo.com'
    const { data: candAuth, error: candErr } = await supabase.auth.admin.createUser({
        email: candidateEmail,
        password: 'password123',
        email_confirm: true,
        user_metadata: { role: 'jobseeker' }
    })

    if (candErr) console.log(`Candidate creation msg: ${candErr.message}`)
    else console.log(`Created Candidate: ${candidateEmail} (${candAuth.user.id})`)

    const candidateId = candAuth.user?.id || (await supabase.from('users').select('id').eq('email', candidateEmail).single()).data?.id

    if (candidateId) {
        await supabase.from('users').upsert({
            id: candidateId,
            email: candidateEmail,
            role: 'jobseeker',
            credits: 10
        })

        // 4. Create ATP
        await supabase.from('atp').insert({
            user_id: candidateId,
            overall_score: 85,
            skills: { 'React': 90, 'TypeScript': 85, 'Node.js': 80 },
            badges: ['Top Performer', 'Fast Learner']
        })
        console.log('Created ATP for Candidate')
    }

    console.log('✅ Seed completed')
}

seed().catch(console.error)
