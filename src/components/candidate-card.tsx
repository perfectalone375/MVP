
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CandidateCard({ candidate }: { candidate: any }) {
    // Parsing json if it's string, or using directly
    const skills = candidate.parsed_json?.skills || []

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar_url} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">Candidate #{candidate.id.slice(0, 4)}</h3>
                    <p className="text-sm text-muted-foreground">Match Score: {(candidate.similarity * 100).toFixed(0)}%</p>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                    {skills.slice(0, 5).map((skill: string) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                    {candidate.parsed_json?.summary || 'No summary available.'}
                </div>
            </CardContent>
        </Card>
    )
}
