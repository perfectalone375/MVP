'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ResumeUpload() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState('')
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setUploading(true)
        setError(null)
        setProgress('Uploading file...')

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('resumes')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 2. Get public URL (or signed URL)
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(fileName)

            setProgress('Parsing resume with AI...')

            // 3. Trigger Parse API
            const response = await fetch('/api/resumes/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileUrl: publicUrl,
                    userId: user.id
                }),
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Failed to parse resume')
            }

            setProgress('Done!')
            router.refresh()

        } catch (err: any) {
            console.error(err)
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }, [supabase, router])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    })

    return (
        <Card>
            <CardContent className="p-6">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-800'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-muted rounded-full">
                            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                {uploading ? progress : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PDF or DOCX (max 5MB)
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 flex items-center p-3 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md text-sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
