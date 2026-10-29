export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
}
