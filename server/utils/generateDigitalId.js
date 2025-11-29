export function generateDigitalId() {
    const prefix = "SUJHAA";
    const rand = Math.floor(100000 + Math.random() * 900000); // 6-digit
    return `${prefix}-${rand}`;
}
