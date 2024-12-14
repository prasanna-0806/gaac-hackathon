// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

// Add tile layer for the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// List of stargazing spots with coordinates
const stargazingSpots = [
    { name: "Horsley Hills", coords: [13.6601, 78.3992] },
    { name: "Rann of Kutch", coords: [23.7333, 70.8007] },
    { name: "Ladakh", coords: [34.1526, 77.5770] },
    { name: "Spiti Valley", coords: [32.2464, 78.0172] },
    { name: "Mahabaleshwar", coords: [17.9235, 73.6586] },
    { name: "Savandurga Hills", coords: [12.9192, 77.2920] },
    { name: "Nandi Hills", coords: [13.3702, 77.6835] },
    { name: "Coorg", coords: [12.3375, 75.8069] }
];

// Function to fetch AQI and light pollution data
async function fetchLightPollutionData(lat, lon) {
    const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // AQI API key

    try {
        // Fetch AQI data
        const aqiResponse = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${airQualityApiKey}`);
        const aqiData = await aqiResponse.json();

        console.log("AQI Data:", aqiData);

        const aqi = aqiData.data ? aqiData.data.aqi : null; // Air Quality Index
        const lightPollutionLevel = aqi !== null ? determineLightPollution(aqi) : "Insufficient Data";

        return { aqi, lightPollutionLevel };
    } catch (error) {
        console.error('Error fetching light pollution data:', error);
        return { aqi: null, lightPollutionLevel: "Error fetching data" };
    }
}

// Helper function to determine light pollution levels based on AQI
function determineLightPollution(aqi) {
    if (aqi < 50) {
        return "Low Light Pollution 🌌";
    } else if (aqi < 100) {
        return "Moderate Light Pollution 🌠";
    } else {
        return "High Light Pollution 🌃";
    }
}

// Add markers for each spot
stargazingSpots.forEach(async (spot) => {
    // Fetch light pollution data
    const { aqi, lightPollutionLevel } = await fetchLightPollutionData(spot.coords[0], spot.coords[1]);

    // Primary marker: Weather, AQI, Suitability
    const marker = L.marker(spot.coords).addTo(map);
    marker.bindPopup(`
        <b>${spot.name}</b><br>
        AQI: ${aqi !== null ? aqi : "N/A"}<br>
        Light Pollution: ${lightPollutionLevel}
    `);

    // Secondary marker: Light pollution data
    const lightPollutionMarker = L.circleMarker(spot.coords, {
        color: 'blue',
        radius: 8,
        fillOpacity: 0.5
    }).addTo(map);

    lightPollutionMarker.bindPopup(`
        <b>${spot.name} (Light Pollution)</b><br>
        AQI: ${aqi !== null ? aqi : "N/A"}<br>
        Light Pollution: ${lightPollutionLevel}
    `);
});
