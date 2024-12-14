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
];

// API URL to fetch wind speed data
const apiURL = "https://api.open-meteo.com/v1/forecast?latitude=13.6601,23.7333,34.1526,32.2464&longitude=78.3992,70.8007,77.577,78.0172&hourly=wind_speed_10m";

// Fetch wind speed data
async function fetchWindSpeedData() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log("API Response:", data);
        return data.hourly.wind_speed_10m; // Assuming wind speed data is in hourly.wind_speed_10m
    } catch (error) {
        console.error('Error fetching wind speed data:', error);
        return [];
    }
}

// Map data to stargazing spots
async function integrateWindSpeed() {
    const windSpeeds = await fetchWindSpeedData();

    if (windSpeeds.length === 0) {
        console.error("No wind speed data available");
        return;
    }

    stargazingSpots.forEach((spot, index) => {
        const marker = L.marker(spot.coords).addTo(map);

        // Assuming windSpeeds[index] matches spot's index
        const windSpeed = windSpeeds[index] || "N/A";

        // Determine suitability
        const suitability = windSpeed < 8 ? "Suitable for Stargazing! 🌌" : "Not Suitable for Stargazing.🚫";

        // Add popup to marker
        marker.bindPopup(`
            <b>${spot.name}</b><br>
            Wind Speed: ${windSpeed} m/s<br>
            ${suitability}
        `);
    });
}

// Integrate data and update map
integrateWindSpeed();
