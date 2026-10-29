/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // Google Auth
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com', // GitHub Auth
            },
            {
                protocol: 'https',
                hostname: 'your-project.supabase.co', // Replace with your actual Supabase URL hostname if different
            },
            // Allow any image from the project's supabase storage if generic
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            }
        ],
    },
    experimental: {
        // serverActions: true, // Enabled by default in Next.js 14+
    },
    // Ensure we can build standalone for Docker
    output: 'standalone',
}

module.exports = nextConfig
