// Initialize the map centered on India (default zoom level)
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Add the base OpenStreetMap tile layer
const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// Add the Light Pollution Map tile layer (replace with correct URL)
const lightPollutionLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors | Light Pollution Map',
    maxZoom: 18,
    opacity: 0.6 // Adjust opacity to blend with other layers
});

// List of famous stargazing locations with coordinates
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

// OpenWeatherMap API key
const weatherApiKey = 'e943ba1a3f38663ee66ba362f50a008a'; // Replace with your OpenWeatherMap API key
const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // Replace with your AQI API key

// Function to fetch windspeed and AQI data from APIs
async function fetchWeatherData(lat, lon) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`;
    const aqiURL = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqiAPIKey}`;

    try {
        // Fetching windspeed from OpenWeatherMap API
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();
        const windspeed = weatherData.wind.speed; // wind speed in m/s

        // Fetching AQI data from World Air Quality Index API
        const aqiResponse = await fetch(aqiURL);
        const aqiData = await aqiResponse.json();
        const aqi = aqiData.data.aqi; // AQI value

        return { windspeed, aqi };
    } catch (error) {
        console.error("Error fetching weather or AQI data:", error);
        return { windspeed: "N/A", aqi: "N/A" };
    }
}

// Function to create markers and popups for each location
async function addMarkers() {
    for (const location of stargazingSpots) {
        const { name, coords } = location;
        const [lat, lon] = coords;

        // Fetch weather and AQI data
        const { windspeed, aqi } = await fetchWeatherData(lat, lon);

        // Create marker for the location
        const marker = L.marker(coords).addTo(map);

        // Create a popup with windspeed, AQI, and suitability message
        const suitability = (aqi < 100 && windspeed < 20) ? 'Suitable for Stargazing' : 'Not Suitable for Stargazing';
        const popupContent = `
            <h3>${name}</h3>
            <p>Windspeed: ${windspeed} m/s</p>
            <p>AQI: ${aqi}</p>
            <p>Stargazing Suitability: ${suitability}</p>
            <button onclick="window.open('https://www.google.com/maps/search/?q=${name}')">Search on Google</button>
        `;

        // Bind popup to the marker
        marker.bindPopup(popupContent);
    }
}

// Add the layer control to toggle between layers
L.control.layers({
    "OpenStreetMap": baseLayer,
    "Light Pollution": lightPollutionLayer
}).addTo(map);

// Add the Light Pollution layer by default
lightPollutionLayer.addTo(map);

// Add markers and popups to the map
addMarkers();
