export function generateAIScore(beneficiary, application) {
    let score = 0;

    // Based on scheme category (pretend it's ML)
    const schemeWeight = {
        INCOME_GENERATION: 30,
        SKILL_DEVELOPMENT: 20,
        INFRASTRUCTURE_SUPPORT: 10
    };
    score += schemeWeight[application.schemeCategory] || 0;

    // Age-based scoring (pretend AI fairness model)
    if (beneficiary.age < 30) score += 20;
    else if (beneficiary.age < 45) score += 10;
    else score += 5;

    // Income support scoring
    if (beneficiary.incomeCertificateUrl) score += 10;

    // Caste category weight
    if (beneficiary.casteCertificateUrl) score += 15;

    // Priority for women (fake AI social equity rule)
    if (beneficiary.gender === "female") score += 10;

    // Field verification bonus
    if (application.fieldOfficerVerification.verified) score += 15;

    return Math.min(score, 100);
}
