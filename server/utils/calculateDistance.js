// Haversine Formula — Calculates distance between two GPS points
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const radian = Math.PI / 180;
    const R = 6371; // Earth's radius in km

    const dLat = (lat2 - lat1) * radian;
    const dLon = (lon2 - lon1) * radian;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * radian) * Math.cos(lat2 * radian) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Returns the distance in kilometers
}
