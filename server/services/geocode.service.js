import axios from "axios";

export const getCoordinates = async (address) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${process.env.OPENCAGE_KEY}`;

    const { data } = await axios.get(url);

    if (!data.results || data.results.length === 0) {
        return { lat: null, lng: null };
    }

    return {
        lat: data.results[0].geometry.lat,
        lng: data.results[0].geometry.lng
    };
};
