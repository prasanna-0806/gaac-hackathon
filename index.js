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

// Function to fetch weather, AQI, and light pollution data
async function fetchDetails(lat, lon) {
    const weatherApiKey = 'e943ba1a3f38663ee66ba362f50a008a'; // Replace with your OpenWeatherMap API key
    const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // Replace with your AQI API key

    try {
        // Fetch weather and AQI data
        const [weatherResponse, aqiResponse] = await Promise.all([
            fetch(https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}),
            fetch(https://api.waqi.info/feed/here/?token=${airQualityApiKey})
        ]);

        const weatherData = await weatherResponse.json();
        const aqiData = await aqiResponse.json();

        // Log API responses to check the structure
        console.log("Weather Data:", weatherData);
        console.log("AQI Data:", aqiData);

        const windSpeed = weatherData.wind ? weatherData.wind.speed : null; // Wind speed in m/s
        const aqi = aqiData.data ? aqiData.data.aqi : null; // Air Quality Index

        // Determine suitability for stargazing based on wind speed and AQI
        let suitability = "Insufficient Data";
        if (windSpeed !== null && aqi !== null) {
            if (windSpeed < 8 && aqi < 90) {
                suitability = "Suitable for Stargazing! 🌌";
            } else {
                suitability = "Not Suitable for Stargazing.🚫";
            }
        }

        // Return all the fetched details
        return { windSpeed, aqi, suitability };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { windSpeed: null, aqi: null, suitability: "Error fetching data" };
    }
}

// Add markers for each spot and fetch dynamic data
stargazingSpots.forEach(async (spot) => {
    const marker = L.marker(spot.coords).addTo(map);

    // Fetch dynamic data (weather, AQI, suitability)
    const { windSpeed, aqi, suitability } = await fetchDetails(spot.coords[0], spot.coords[1]);

    // Log the data being used in the popup
    console.log(Data for ${spot.name}: Wind Speed - ${windSpeed}, AQI - ${aqi}, Suitability - ${suitability});

    // Add a detailed popup with all the fetched data
    marker.bindPopup(`
        <b>${spot.name}</b><br>
        Wind Speed: ${windSpeed !== null ? ${windSpeed} m/s : "N/A"}<br>
        AQI: ${aqi !== null ? aqi : "N/A"}<br>
        ${suitability}
    `);
});
