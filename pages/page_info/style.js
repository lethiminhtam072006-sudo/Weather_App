// ⚠️ THAY ĐỔI API KEY TẠI ĐÂY
const API_KEY = "c4cbb91daa6ed9185682c8650441c74b"; // Thay bằng API key của bạn từ openweathermap.org
const BASE_URL = "https://api.openweathermap.org/data/2.5";

let tempChart = null;

// Weather icon mapping
const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⚡",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

// Get weather icon
function getWeatherIcon(main) {
  return weatherIcons[main] || "🌤️";
}

// Format day name
function getDayName(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

// Show/Hide elements
// function showElement(id) {
//   document.getElementById(id).style.display = "block";
// }

// function hideElement(id) {
//   document.getElementById(id).style.display = "none";
// }

// Show error message
// function showError(message) {
//   const errorMsg = document.getElementById("errorMsg");
//   errorMsg.textContent = message;
//   showElement("errorMsg");
//   setTimeout(() => hideElement("errorMsg"), 5000);
// }

// Fetch current weather
async function fetchCurrentWeather(city) {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("City not found");
  }

  return await response.json();
}

// Fetch forecast
async function fetchForecast(city) {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast");
  }

  return await response.json();
}

// Update current weather display
function updateCurrentWeather(data) {
  document.getElementById(
    "cityName"
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById(
    "chanceRain"
  ).textContent = `Cloudiness: ${data.clouds.all}%`;
  document.getElementById("currentTemp").textContent = `${Math.round(
    data.main.temp
  )}°`;
  document.getElementById("weatherIcon").textContent = getWeatherIcon(
    data.weather[0].main
  );
  document.getElementById("weatherDesc").textContent =
    data.weather[0].description;

  // Air conditions
  document.getElementById("feelsLike").textContent = `${Math.round(
    data.main.feels_like
  )}°`;
  document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
}

// Update chart
function updateChart(forecastData) {
  const next24Hours = forecastData.list.slice(0, 8);

  const labels = next24Hours.map((item) => {
    const date = new Date(item.dt * 1000);
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  });

  const temps = next24Hours.map((item) => Math.round(item.main.temp));

  const ctx = document.getElementById("tempChart").getContext("2d");

  if (tempChart) {
    tempChart.destroy();
  }

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature",
          data: temps,
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#F59E0B",
          pointBorderColor: "#F59E0B",
          pointHoverRadius: 7,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e293b",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#475569",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return context.parsed.y + "°C";
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#9ca3af",
            font: { size: 12 },
            callback: function (value) {
              return value + "°";
            },
          },
          grid: {
            color: "#374151",
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: "#9ca3af",
            font: { size: 12 },
          },
          grid: {
            color: "#374151",
            drawBorder: false,
          },
        },
      },
    },
  });
}

// Update 5-day forecast
function updateForecast(forecastData) {
  const dailyData = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        temps: [],
        weather: item.weather[0].main,
        date: date,
      };
    }

    dailyData[dateKey].temps.push(item.main.temp);
  });

  const forecastList = document.getElementById("forecastList");
  forecastList.innerHTML = "";

  Object.values(dailyData)
    .slice(0, 5)
    .forEach((day, index) => {
      const dayName = index === 0 ? "Today" : getDayName(day.date);
      const high = Math.round(Math.max(...day.temps));
      const low = Math.round(Math.min(...day.temps));
      const icon = getWeatherIcon(day.weather);

      const dayHTML = `
            <div class="forecast-day">
                <div class="day-name">${dayName}</div>
                <div class="day-weather">
                    <div class="day-icon">${icon}</div>
                    <div class="day-condition">${day.weather}</div>
                </div>
                <div class="day-temp">
                    <span class="temp-high">${high}</span><span class="temp-low">/${low}</span>
                </div>
            </div>
        `;

      forecastList.innerHTML += dayHTML;
    });
}

// Load weather data
async function loadWeather(city) {
  if (!API_KEY) {
    showError("Please add your OpenWeatherMap API key in the codey");
    return;
  }

  try {
    // showElement("loading");
    // hideElement("weatherContent");
    // hideElement("errorMsg");

    const [currentWeather, forecast] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
    ]);

    updateCurrentWeather(currentWeather);
    updateChart(forecast);
    updateForecast(forecast);

    // hideElement("loading");
    // hideElement("apiNotice");
    // showElement("weatherContent");
  } catch (error) {
    // hideElement("loading");
    // showError(error.message || "Failed to fetch weather data");
    alert(error.message || "Failed to fetch weather data");
    console.error("Error:", error);
  }
}

// Event listeners
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("searchInput").value.trim();
  if (city) {
    loadWeather(city);
  }
});

document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value.trim();
    if (city) {
      loadWeather(city);
    }
  }
});

// Load default city on page load
window.addEventListener("load", () => {
  loadWeather("Madrid");
});
