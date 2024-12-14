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
    { name: "Coorg", coords: [12.3375, 75.8069] },
    { name: "Auli", coords: [30.0691, 79.5363] }, // Auli in Uttarakhand
    { name: "Mount Abu", coords: [24.5854, 72.7103] }, // Mount Abu in Rajasthan
    { name: "Tawang", coords: [27.5542, 91.8594] }, // Tawang in Arunachal Pradesh
    { name: "Munsiyari", coords: [30.0650, 80.0602] }, // Munsiyari in Uttarakhand
    { name: "Tirunelveli", coords: [8.7342, 77.7197] }, // Tirunelveli in Tamil Nadu
    { name: "Kanha National Park", coords: [22.2447, 80.6680] }, // Kanha National Park in Madhya Pradesh
    { name: "Chopta", coords: [30.2042, 79.2714] }, // Chopta in Uttarakhand
    { name: "Darjeeling", coords: [27.0350, 88.2636] }, // Darjeeling in West Bengal
    { name: "Ziro Valley", coords: [27.5815, 93.8260] }, // Ziro Valley in Arunachal Pradesh
    { name: "Lonavala", coords: [18.7500, 73.4092] }, // Lonavala in Maharashtra
    { name: "Kumarakom", coords: [9.6007, 76.5156] }, // Kumarakom in Kerala
    { name: "Gulmarg", coords: [34.0510, 74.3738] }, // Gulmarg in Jammu & Kashmir
    { name: "Sundarbans", coords: [22.0800, 88.7950] }, // Sundarbans in West Bengal
    { name: "Jaisalmer", coords: [26.9157, 70.9223] }, // Jaisalmer in Rajasthan
    { name: "Rishikesh", coords: [30.1236, 78.3171] } // Rishikesh in Uttarakhand
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
