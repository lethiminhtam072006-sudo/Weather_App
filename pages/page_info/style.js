const API_KEY = "76be224612589a9786da08fbe1feade7";

const search = document.querySelector(".search");
const cityNameEl = document.getElementById("cityName");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherDescEl = document.getElementById("weatherDesc");
const currentTempEl = document.getElementById("currentTemp");
const feelsLikeEl = document.getElementById("feelsLike");
const windSpeedEl = document.getElementById("windSpeed");
const humidityEl = document.getElementById("humidity");
const pressureEl = document.getElementById("pressure");
const forecastListEl = document.getElementById("forecastList");

const weatherIcons = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

const weatherVideos = {
  "01d": "../../images/sunny-day.mp4",
  "01n": "../../images/clear-night.mp4",
  "02d": "../../images/sunny-day.mp4",
  "02n": "../../images/cloudy-night.mp4",
  "03d": "../../images/cloudy-day.mp4",
  "03n": "../../images/cloudy-night.mp4",
  "04d": "../../images/cloudy-day.mp4",
  "04n": "../../images/cloudy-night.mp4",
  "09d": "../../images/rainy-day.mp4",
  "09n": "../../images/rainy-night.mp4",
  "10d": "../../images/rainy-day.mp4",
  "10n": "../../images/rainy-night.mp4",
  "11d": "../../images/storm.mp4",
  "11n": "../../images/storm.mp4",
  "13d": "../../images/snow.mp4",
  "13n": "../../images/snow.mp4",
  "50d": "../../images/fog-day.mp4",
  "50n": "../../images/fog-night.mp4",
};

// ============================================
// UPDATE BACKGROUND VIDEO
// ============================================
function updateBackgroundVideo(iconCode) {
  const videoElement = document.querySelector(".video");
  const videoSource = videoElement.querySelector("source");
  const newSrc = weatherVideos[iconCode] || "../../images/night.mp4";
  if (videoSource.src !== newSrc) {
    videoSource.src = newSrc;
    videoElement.load();
    videoElement.play();
  }
}

// ============================================
// CITY COORDINATES
// ============================================
const cityCoordinates = {
  "Ha Noi": { lat: 21.0285, lon: 105.8542, name: "Hà Nội" },
  Hanoi: { lat: 21.0285, lon: 105.8542, name: "Hà Nội" },
  "Ho Chi Minh City": { lat: 10.8231, lon: 106.6297, name: "Hồ Chí Minh" },
  "Ho Chi Minh": { lat: 10.8231, lon: 106.6297, name: "Hồ Chí Minh" },
  Saigon: { lat: 10.8231, lon: 106.6297, name: "Sài Gòn" },
  "Da Nang": { lat: 16.0544, lon: 108.2022, name: "Đà Nẵng" },
  "Hai Phong": { lat: 20.8449, lon: 106.6881, name: "Hải Phòng" },
  "Can Tho": { lat: 10.0452, lon: 105.7469, name: "Cần Thơ" },
  "Quy Nhon": { lat: 13.783, lon: 109.2196, name: "Quy Nhơn" },
  "Nha Trang": { lat: 12.2388, lon: 109.1967, name: "Nha Trang" },
  "Da Lat": { lat: 11.9404, lon: 108.4583, name: "Đà Lạt" },
  "Vung Tau": { lat: 10.346, lon: 107.0843, name: "Vũng Tàu" },
  Hue: { lat: 16.4637, lon: 107.5909, name: "Huế" },
  "Ha Long": { lat: 20.9511, lon: 107.0763, name: "Hạ Long" },
  "Bien Hoa": { lat: 10.951, lon: 106.823, name: "Biên Hòa" },
  "Ca Mau": { lat: 9.1769, lon: 105.1524, name: "Cà Mau" },
};

// ============================================
// GEOCODING FALLBACK
// ============================================
async function getCityCoordinates(city) {
  try {
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city + ", Vietnam")}&limit=5&appid=${API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();

    if (data.length === 0) {
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;
      res = await fetch(url);
      data = await res.json();
    }

    if (data.length > 0) {
      const vn = data.find((d) => d.country === "VN") || data[0];
      return { lat: vn.lat, lon: vn.lon, name: vn.name };
    }
    return null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

// ============================================
// FETCH CURRENT WEATHER
// ============================================
async function fetchWeatherByCoords(lat, lon, displayName = null) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const iconCode = data.weather[0].icon;

    cityNameEl.textContent = displayName || data.name;
    weatherIconEl.textContent = weatherIcons[iconCode] || "🌤️";
    weatherDescEl.textContent = data.weather[0].description;
    currentTempEl.textContent = Math.round(data.main.temp) + "°C";
    feelsLikeEl.textContent = Math.round(data.main.feels_like) + "°C";
    windSpeedEl.textContent = (data.wind.speed * 3.6).toFixed(1) + " km/h";
    humidityEl.textContent = data.main.humidity + "%";
    pressureEl.textContent = data.main.pressure + " hPa";

    updateBackgroundVideo(iconCode);
    await fetchForecast(lat, lon);
  } catch (err) {
    console.error("fetchWeatherByCoords error:", err);
    alert("Không thể lấy dữ liệu thời tiết. Vui lòng thử lại!");
  }
}

// ============================================
// FETCH 7-DAY FORECAST
// ============================================
async function fetchForecast(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Nhóm theo ngày, lấy max/min temp
    const days = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString("vi-VN", { weekday: "short" });
      const fullKey = date.toDateString();

      if (!days[fullKey]) {
        days[fullKey] = {
          label: dayKey,
          high: item.main.temp_max,
          low: item.main.temp_min,
          icon: item.weather[0].icon,
          desc: item.weather[0].description,
        };
      } else {
        days[fullKey].high = Math.max(days[fullKey].high, item.main.temp_max);
        days[fullKey].low = Math.min(days[fullKey].low, item.main.temp_min);
      }
    });

    const dayEntries = Object.values(days).slice(0, 7);

    forecastListEl.innerHTML = dayEntries
      .map(
        (d, i) => `
      <div class="forecast-day">
        <div class="day-name">${i === 0 ? "Today" : d.label}</div>
        <div class="day-weather">
          <div class="day-icon">${weatherIcons[d.icon] || "🌤️"}</div>
          <div class="day-condition">${d.desc}</div>
        </div>
        <div class="day-temp">
          <span class="temp-high">${Math.round(d.high)}</span>
          <span class="temp-low">/${Math.round(d.low)}</span>
        </div>
      </div>
    `,
      )
      .join("");

    renderChart(dayEntries);
  } catch (err) {
    console.error("fetchForecast error:", err);
  }
}

// ============================================
// CHART (TODAY'S FORECAST)
// ============================================
let chartInstance = null;

function renderChart(days) {
  const ctx = document.getElementById("tempChart");
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

  const labels = days.map((d, i) => (i === 0 ? "Hôm nay" : d.label));
  const highs = days.map((d) => Math.round(d.high));
  const lows = days.map((d) => Math.round(d.low));

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "°C CAO",
          data: highs,
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.15)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#f97316",
          pointRadius: 5,
        },
        {
          label: "°C THẤP",
          data: lows,
          borderColor: "#60a5fa",
          backgroundColor: "rgba(96,165,250,0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#60a5fa",
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#d1d5db", font: { size: 12 } } },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          ticks: { color: "#9ca3af", callback: (v) => v + "°" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
    },
  });
}

// ============================================
// MAIN FETCH ENTRY POINT
// ============================================
async function fetchWeather(city) {
  const normalized = city
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D"));

  let found = null;
  for (const [key, val] of Object.entries(cityCoordinates)) {
    const normKey = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D"));
    if (normKey.toLowerCase() === normalized.toLowerCase()) {
      found = val;
      break;
    }
  }

  if (found) {
    await fetchWeatherByCoords(found.lat, found.lon, found.name);
  } else {
    const coords = await getCityCoordinates(city.trim());
    if (coords) {
      await fetchWeatherByCoords(coords.lat, coords.lon, coords.name);
    } else {
      alert(`Không tìm thấy: "${city}"\nVui lòng thử tên tiếng Anh.`);
    }
  }
}

// ============================================
// SEARCH
// ============================================
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && search.value.trim()) {
    fetchWeather(search.value.trim());
    search.value = "";
  }
});

// ============================================
// DEFAULT LOAD
// ============================================
const params = new URLSearchParams(window.location.search);
const cityFromURL = params.get("city");
fetchWeather(cityFromURL || "Ho Chi Minh City");
