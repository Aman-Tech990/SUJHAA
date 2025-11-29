export function generateOfficerId(role) {
    const prefix = {
        FIELD: "FO",
        DISTRICT: "DO",
        STATE: "SO",
        CENTRAL: "CO"
    }[role];

    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${random}`;
}
