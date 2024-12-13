// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

L.tileLayer("https://tiles.lightpollutionmap.info/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://lightpollutionmap.info/">LightPollutionMap</a>',
  maxZoom: 18,
}).addTo(map);

// List of stargazing spots
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

// Function to fetch weather and AQI data
async function fetchWeatherAndAQI(lat, lon) {
    const weatherApiKey = 'c2c07ed68408e1730b71769f8740c726'; // Replace with your API key
    const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // Replace with your API key

    try {
        const [weatherResponse, aqiResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`),
            fetch(`https://api.waqi.info/feed/here/?token=a87d60b45493985ee0c842179fd66174a556f4fe`)
        ]);

        const weatherData = await weatherResponse.json();
        const aqiData = await aqiResponse.json();

        const windSpeed = weatherData.wind.speed; // in m/s
        const aqi = aqiData.data.aqi; // Air Quality Index

        return { windSpeed, aqi };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { windSpeed: null, aqi: null };
    }
}

// Add markers for each spot
stargazingSpots.forEach(async spot => {
    const marker = L.marker(spot.coords).addTo(map);

    // Fetch dynamic data
    const { windSpeed, aqi } = await fetchWeatherAndAQI(spot.coords[0], spot.coords[1]);

    // Determine suitability for stargazing
    let suitability = "Insufficient Data";
    if (windSpeed !== null && aqi !== null) {
        if (windSpeed < 8 && aqi < 90) {
            suitability = "Suitable for Stargazing! 🌌";
        } else {
            suitability = "Not Suitable for Stargazing.🚫";
        }
    }

    // Add popup with dynamic data
    marker.bindPopup(`
        <b>${spot.name}</b><br>
        Wind Speed: ${windSpeed !== null ? `${windSpeed} m/s` : "N/A"}<br>
        AQI: ${aqi !== null ? aqi : "N/A"}<br>
        ${suitability}
    `);
});
