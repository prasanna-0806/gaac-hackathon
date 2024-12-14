// Initialize the map centered on India (default zoom level)
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Add the base OpenStreetMap tile layer
const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// Add the Light Pollution Map tile layer (replace with correct URL)
const lightPollutionLayer = L.tileLayer("https://www.lightpollutionmap.info/#zoom=4.43&lat=31.8074&lon=80.2820&state=eyJiYXNlbWFwIjoiTGF5ZXJCaW5nUm9hZCIsIm92ZXJsYXkiOiJ3YV8yMDE1Iiwib3ZlcmxheWNvbG9yIjpmYWxzZSwib3ZlcmxheW9wYWNpdHkiOjYwLCJmZWF0dXJlc29wYWNpdHkiOjg1fQ==", {
    attribution: '© OpenStreetMap contributors | Light Pollution Map',
    maxZoom: 18,
    opacity: 0.6 // Adjust opacity to blend with other layers
});

// List of famous stargazing locations with coordinates
const stargazingSpots = [
    { name: "Horsley Hills", coords: [13.6601, 78.3992] },
    { name: "Rann of Kutch", coords: [23.7333, 70.8007] },
    { name: "Ladakh", coords: [34.1526, 77.5770] },
    // Add more spots as needed
];

// OpenWeatherMap API key
const weatherApiKey = 'e943ba1a3f38663ee66ba362f50a008a'; // Replace with your OpenWeatherMap API key
const airQualityApiKey = 'a87d60b45493985ee0c842179fd66174a556f4fe'; // Replace with your AQI API key

// Function to fetch windspeed and AQI data from APIs
async function fetchWeatherData(lat, lon) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;
    const aqiURL = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${airQualityApiKey}`;

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
        
        // Logging the location for debugging
        console.log("Adding marker for:", name);

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
