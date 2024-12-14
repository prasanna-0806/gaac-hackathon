// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

// Add tile layer for the map (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// Add the Light Pollution Tile Layer (Dark Site Finder)
const lightPollutionTileLayer = L.tileLayer(
    'https://darksky.darksitefinder.com/tiles/{z}/{x}/{y}.png', {
        attribution: 'Light Pollution Data © 2021 Dark Site Finder',
        maxZoom: 8,
        minZoom: 3
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

// Function to fetch weather, AQI data
async function fetchDetails(lat, lon) {
    const weatherApiKey = 'e943ba1a3f38663ee66ba362f50a008a'; // Replace with your OpenWeatherMap API key
    const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // Replace with your AQI API key

    try {
        // Fetch weather and AQI data
        const [weatherResponse, aqiResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`),
            fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${airQualityApiKey}`)
        ]);

        const weatherData = await weatherResponse.json();
        const aqiData = await aqiResponse.json();

        const windSpeed = weatherData.wind ? weatherData.wind.speed : null; // Wind speed in m/s
        const aqi = aqiData.data ? aqiData.data.aqi : null; // Air Quality Index

        return { windSpeed, aqi };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { windSpeed: null, aqi: null };
    }
}

// Function to determine stargazing suitability
function isSuitableForStargazing(windSpeed, aqi) {
    if (windSpeed < 8 && aqi < 90) {
        return "Suitable for Stargazing! 🌌";
    } else {
        return "Not Suitable for Stargazing 🚫";
    }
}

// Add markers for each spot and fetch dynamic data
stargazingSpots.forEach(async (spot) => {
    // Fetch weather and AQI data
    const { windSpeed, aqi } = await fetchDetails(spot.coords[0], spot.coords[1]);

    // Determine stargazing suitability
    const suitability = isSuitableForStargazing(windSpeed, aqi);

    // Marker for each stargazing spot
    const marker = L.marker(spot.coords).addTo(map);

    // Bind a popup to the marker
    marker.bindPopup(`
        <b>${spot.name}</b><br>
        Wind Speed: ${windSpeed !== null ? `${windSpeed} m/s` : "N/A"}<br>
        AQI: ${aqi !== null ? aqi : "N/A"}<br>
        Suitability for Stargazing: ${suitability}
    `);
});
