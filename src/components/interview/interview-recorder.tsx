'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mic, Square, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function InterviewRecorder({ interviewId, question }: { interviewId?: string, question: string }) {
    const [recording, setRecording] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [complete, setComplete] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const router = useRouter()

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            const mediaRecorder = new MediaRecorder(stream)

            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' })
                await handleUpload(blob)
                stream.getTracks().forEach(track => track.stop()) // Stop camera
            }

            mediaRecorder.start()
            setRecording(true)
        } catch (err) {
            console.error('Error accessing media devices:', err)
            alert('Could not access camera/microphone')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop()
            setRecording(false)
        }
    }

    const handleUpload = async (blob: Blob) => {
        setUploading(true)
        try {
            // Create a File object from Blob
            const file = new File([blob], 'interview_recording.webm', { type: 'video/webm' })
            const formData = new FormData()
            formData.append('file', file)
            formData.append('question', question)
            // formData.append('interviewId', interviewId || '') // For creating new vs updating

            const res = await fetch('/api/interviews/process', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Failed to process interview')

            const data = await res.json()
            setComplete(true)
            router.refresh()

        } catch (err) {
            console.error(err)
            alert('Failed to upload/process interview')
        } finally {
            setUploading(false)
        }
    }

    if (complete) {
        return (
            <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Video className="h-6 w-6 text-green-600" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-green-700">Interview Submitted!</h3>
                <p className="text-muted-foreground mt-2">Your response effectively demonstrated your communication skills.</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>Next Question</Button>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Interview Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Current Question:</h4>
                    <p className="text-lg">{question}</p>
                </div>

                <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                    {recording ? (
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-4 bg-red-500 rounded-full mb-2" />
                            <p>Recording...</p>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Camera Preview</p>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="justify-center gap-4">
                {!recording ? (
                    <Button onClick={startRecording} disabled={uploading}>
                        <Mic className="mr-2 h-4 w-4" /> Start Answer
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={stopRecording} disabled={uploading}>
                        <Square className="mr-2 h-4 w-4" /> Stop & Submit
                    </Button>
                )}

                {uploading && (
                    <div className="flex items-center text-sm text-yellow-600">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI Analysis in progress...
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
