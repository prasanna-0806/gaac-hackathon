// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

// Add tile layer
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
    const weatherApiKey = 'c2c07ed68408e1730b71769f8740c726'; // Replace with your OpenWeatherMap API key
    const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // Replace with your AQI API key
    const lightPollutionApiUrl = `https://api.lightpollutionmap.info/v1/data?lat=${lat}&lon=${lon}`; // Placeholder URL for light pollution data

    try {
        // Fetch weather, AQI, and light pollution data
        const [weatherResponse, aqiResponse, lightPollutionResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`),
            fetch(`https://api.waqi.info/feed/here/?token=${airQualityApiKey}`),
            fetch(lightPollutionApiUrl)  // Light pollution data
        ]);

        const weatherData = await weatherResponse.json();
        const aqiData = await aqiResponse.json();
        const lightPollutionData = await lightPollutionResponse.json(); // Assuming the response contains light pollution data

        const windSpeed = weatherData.wind.speed; // Wind speed in m/s
        const aqi = aqiData.data.aqi; // Air Quality Index
        const lightPollution = lightPollutionData.value; // Example field for light pollution

        // Determine suitability for stargazing based on wind speed, AQI, and light pollution
        let suitability = "Insufficient Data";
        if (windSpeed < 8 && aqi < 90 && lightPollution < 3) { // Example condition for light pollution
            suitability = "Suitable for Stargazing! 🌌";
        } else {
            suitability = "Not Suitable for Stargazing.🚫";
        }

        // Return all the fetched details
        return { windSpeed, aqi, lightPollution, suitability };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { windSpeed: null, aqi: null, lightPollution: null, suitability: "Error fetching data" };
    }
}

// Add markers for each spot and fetch dynamic data (weather, AQI, light pollution)
stargazingSpots.forEach(async spot => {
    const marker = L.marker(spot.coords).addTo(map);

    // Fetch dynamic data (weather, AQI, light pollution)
    const { windSpeed, aqi, lightPollution, suitability } = await fetchDetails(spot.coords[0], spot.coords[1]);

    // Add a detailed popup with all the fetched data
    marker.bindPopup(`
        <b>${spot.name}</b><br>
        Wind Speed: ${windSpeed !== null ? `${windSpeed} m/s` : "N/A"}<br>
        AQI: ${aqi !== null ? aqi : "N/A"}<br>
        Light Pollution: ${lightPollution !== null ? lightPollution : "N/A"}<br>
        ${suitability}
    `);
});





