
export interface ATPData {
    resume_score: number
    domain_interview_score: number
    communication_score: number
    behavioural_score: number
    fraud_risk_score: number
    // ... other scores
}

export function calculateATP(scores: ATPData) {
    // Weighted Average Logic
    const weights = {
        resume: 0.2,
        domain: 0.3,
        communication: 0.2,
        behavioral: 0.2,
        fraud_penalty: 1.0 // Multiplier? Or subtraction?
    }

    let baseScore =
        (scores.resume_score * weights.resume) +
        (scores.domain_interview_score * weights.domain) +
        (scores.communication_score * weights.communication) +
        (scores.behavioural_score * weights.behavioral)

    // Normalize if weights don't sum to 1 (they sum to 0.9 here, let's say / 0.9)
    baseScore = (baseScore / 0.9)

    // Penalize for fraud
    if (scores.fraud_risk_score > 50) {
        baseScore -= 20
    }

    return Math.max(0, Math.min(100, baseScore))
}

export function determineBadges(scores: ATPData): string[] {
    const badges = []
    if (scores.domain_interview_score > 85) badges.push('Domain Expert')
    if (scores.communication_score > 90) badges.push('Top Communicator')
    if (scores.resume_score > 80) badges.push('Stellar Profile')
    return badges
}
