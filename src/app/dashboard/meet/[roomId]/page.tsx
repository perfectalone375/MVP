
'use client'

import { VideoRoom } from '@/components/meeting/video-room'
import { useParams } from 'next/navigation'

export default function MeetingPage() {
    const params = useParams()
    // In real app, fetch from API or Env. User must provide standard Agora App ID.
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || ''

    if (!appId) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-red-500">Missing Configuration</h2>
                <p>Please set NEXT_PUBLIC_AGORA_APP_ID in env-config.txt</p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-4rem)] p-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Interview Room: {params.roomId}</h1>
            </div>
            <VideoRoom roomId={params.roomId as string} appId={appId} />
        </div>
    )
}
