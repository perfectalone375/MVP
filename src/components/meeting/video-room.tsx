'use client'

import { AgoraRTCProvider, useRTCClient, useConnectionState, useLocalMicrophoneTrack, useLocalCameraTrack, useRemoteUsers, RemoteUser, LocalUser } from 'agora-rtc-react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AIOverlay } from './ai-overlay'

export function VideoRoom({ roomId, appId }: { roomId: string, appId: string }) {
    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }) as any)

    return (
        <AgoraRTCProvider client={client}>
            <RoomContent roomId={roomId} appId={appId} />
        </AgoraRTCProvider>
    )
}

function RoomContent({ roomId, appId }: { roomId: string, appId: string }) {
    const client = useRTCClient()
    const [active, setActive] = useState(false)
    const connectionState = useConnectionState()
    const router = useRouter()

    // Tracks
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(active)
    const { localCameraTrack } = useLocalCameraTrack(active)
    const remoteUsers = useRemoteUsers()

    useEffect(() => {
        if (!appId) return
        const init = async () => {
            await client.join(appId, roomId, null, null)
            setActive(true)
        }
        init()
        return () => {
            setActive(false)
            client.leave()
        }
    }, [appId, roomId, client])

    const [micOn, setMicOn] = useState(true)
    const [cameraOn, setCameraOn] = useState(true)

    if (connectionState === 'CONNECTING' || connectionState === 'DISCONNECTED') {
        if (!active) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="flex h-[80vh] gap-4">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col bg-slate-950 rounded-xl overflow-hidden relative">
                <div className="flex-1 grid grid-cols-2 gap-2 p-4">
                    {/* Local User */}
                    <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                        <LocalUser
                            audioTrack={localMicrophoneTrack}
                            cameraOn={cameraOn}
                            micOn={micOn}
                            videoTrack={localCameraTrack}
                            cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                        >
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">You</div>
                        </LocalUser>
                    </div>

                    {/* Remote Users */}
                    {remoteUsers.map(user => (
                        <div key={user.uid} className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                            <RemoteUser user={user} cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg">
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">Candidate {user.uid}</div>
                            </RemoteUser>
                        </div>
                    ))}

                    {remoteUsers.length === 0 && (
                        <div className="flex items-center justify-center text-slate-500 bg-slate-900 rounded-lg border border-slate-800">
                            Waiting for others to join...
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
                    <Button variant={micOn ? "secondary" : "destructive"} size="icon" onClick={() => setMicOn(!micOn)}>
                        {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button variant={cameraOn ? "secondary" : "destructive"} size="icon" onClick={() => setCameraOn(!cameraOn)}>
                        {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="destructive" onClick={() => router.push('/dashboard')}>
                        <PhoneOff className="mr-2 h-4 w-4" /> Leave
                    </Button>
                </div>
            </div>

            {/* Side Panel (AI Assistant) */}
            <div className="w-80 hidden md:block">
                <AIOverlay />
            </div>
        </div>
    )
}
