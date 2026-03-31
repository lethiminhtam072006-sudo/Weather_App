const API_KEY = "76be224612589a9786da08fbe1feade7";
let isCelsius = true;
let currentTempC = 0;

const search = document.querySelector(".search");
const cityName = document.getElementById("cityName");
const countryCode = document.getElementById("countryCode");
const tempCelsius = document.getElementById("tempCelsius");
const tempFahrenheit = document.getElementById("tempFahrenheit");
const weatherData = document.getElementById("weatherData");
const loading = document.getElementById("loading");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDesc = document.getElementById("weatherDesc");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const currentTime = document.getElementById("currentTime");
const currentDate = document.getElementById("currentDate");
const navCities = document.querySelectorAll(".nav-city");
const toggleUnit = document.getElementById("toggleUnit");
const slider = document.getElementById("slider");
const celsiusBtn = document.getElementById("celsius");
const fahrenheitBtn = document.getElementById("fahrenheit");

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
  // Clear sky (Trời quang)
  "01d": "../../images/sunny-day.mp4", // Nắng ban ngày
  "01n": "../../images/clear-night.mp4", // Đêm quang đãng

  // Few clouds (Ít mây)
  "02d": "../../images/sunny-day.mp4",
  "02n": "../../images/cloudy-night.mp4",

  // Scattered clouds (Mây rải rác)
  "03d": "../../images/cloudy-day.mp4",
  "03n": "../../images/cloudy-night.mp4",

  // Broken clouds (Nhiều mây)
  "04d": "../../images/cloudy-day.mp4",
  "04n": "../../images/cloudy-night.mp4",

  // Shower rain (Mưa rào)
  "09d": "../../images/rainy-day.mp4",
  "09n": "../../images/rainy-night.mp4",

  // Rain (Mưa)
  "10d": "../../images/rainy-day.mp4",
  "10n": "../../images/rainy-night.mp4",

  // Thunderstorm (Giông)
  "11d": "../../images/storm.mp4",
  "11n": "../../images/storm.mp4",

  // Snow (Tuyết)
  "13d": "../../images/snow.mp4",
  "13n": "../../images/snow.mp4",

  "50d": "../../images/fog-day.mp4",
  "50n": "../../images/fog-night.mp4",
};

// ============================================
// HÀM THAY ĐỔI VIDEO BACKGROUND
// ============================================
function updateBackgroundVideo(weatherIcon) {
  const videoElement = document.querySelector(".video");
  const videoSource = videoElement.querySelector("source");

  // Lấy video tương ứng với weather icon
  const newVideoSrc = weatherVideos[weatherIcon] || "../../images/night.mp4";

  // Chỉ thay đổi nếu video khác với video hiện tại
  if (videoSource.src !== newVideoSrc) {
    videoSource.src = newVideoSrc;
    videoElement.load(); // Load video mới
    videoElement.play(); // Phát video
  }
}

// Tọa độ 34 tỉnh thành Việt Nam
const cityCoordinates = {
  // 5 Thành phố trực thuộc TW
  "Ha Noi": { lat: 21.0285, lon: 105.8542, name: "Hà Nội" },
  Hanoi: { lat: 21.0285, lon: 105.8542, name: "Hà Nội" },
  "Ho Chi Minh City": { lat: 10.8231, lon: 106.6297, name: "Hồ Chí Minh" },
  "Ho Chi Minh": { lat: 10.8231, lon: 106.6297, name: "Hồ Chí Minh" },
  Saigon: { lat: 10.8231, lon: 106.6297, name: "Sài Gòn" },
  "Da Nang": { lat: 16.0544, lon: 108.2022, name: "Đà Nẵng" },
  Danang: { lat: 16.0544, lon: 108.2022, name: "Đà Nẵng" },
  "Hai Phong": { lat: 20.8449, lon: 106.6881, name: "Hải Phòng" },
  Haiphong: { lat: 20.8449, lon: 106.6881, name: "Hải Phòng" },
  "Can Tho": { lat: 10.0452, lon: 105.7469, name: "Cần Thơ" },

  // 11 Tỉnh Miền Bắc
  "Cao Bang": { lat: 22.6666, lon: 106.2639, name: "Cao Bằng" },
  "Lao Cai": { lat: 22.4809, lon: 103.9755, name: "Lào Cai" },
  "Son La": { lat: 21.3256, lon: 103.9188, name: "Sơn La" },
  "Thai Nguyen": { lat: 21.5671, lon: 105.8252, name: "Thái Nguyên" },
  "Quang Ninh": { lat: 21.0064, lon: 107.2925, name: "Quảng Ninh" },
  "Ha Long": { lat: 20.9511, lon: 107.0763, name: "Hạ Long" },
  Halong: { lat: 20.9511, lon: 107.0763, name: "Hạ Long" },
  "Bac Giang": { lat: 21.2819, lon: 106.1975, name: "Bắc Giang" },
  "Bac Ninh": { lat: 21.1214, lon: 106.111, name: "Bắc Ninh" },
  "Hai Duong": { lat: 20.9373, lon: 106.3145, name: "Hải Dương" },
  "Thai Binh": { lat: 20.4464, lon: 106.3365, name: "Thái Bình" },
  "Nam Dinh": { lat: 20.4388, lon: 106.1621, name: "Nam Định" },
  "Ninh Binh": { lat: 20.2506, lon: 105.9744, name: "Ninh Bình" },

  // 10 Tỉnh Miền Trung
  "Thanh Hoa": { lat: 19.8067, lon: 105.7851, name: "Thanh Hóa" },
  "Nghe An": { lat: 19.2342, lon: 104.92, name: "Nghệ An" },
  Vinh: { lat: 18.6796, lon: 105.6813, name: "Vinh" },
  "Ha Tinh": { lat: 18.3559, lon: 105.8877, name: "Hà Tĩnh" },
  "Quang Binh": { lat: 17.5459, lon: 106.3522, name: "Quảng Bình" },
  "Dong Hoi": { lat: 17.4833, lon: 106.6, name: "Đồng Hới" },
  Hue: { lat: 16.4637, lon: 107.5909, name: "Huế" },
  "Thua Thien Hue": { lat: 16.4637, lon: 107.5909, name: "Thừa Thiên Huế" },
  "Quang Nam": { lat: 15.5393, lon: 108.0191, name: "Quảng Nam" },
  "Hoi An": { lat: 15.8801, lon: 108.338, name: "Hội An" },
  "Binh Dinh": { lat: 14.1665, lon: 108.9027, name: "Bình Định" },
  "Quy Nhon": { lat: 13.783, lon: 109.2196, name: "Quy Nhơn" },
  "Khanh Hoa": { lat: 12.2585, lon: 109.0526, name: "Khánh Hòa" },
  "Nha Trang": { lat: 12.2388, lon: 109.1967, name: "Nha Trang" },
  "Lam Dong": { lat: 11.9465, lon: 108.4419, name: "Lâm Đồng" },
  Dalat: { lat: 11.9404, lon: 108.4583, name: "Đà Lạt" },
  "Da Lat": { lat: 11.9404, lon: 108.4583, name: "Đà Lạt" },
  "Binh Thuan": { lat: 11.0904, lon: 108.0721, name: "Bình Thuận" },
  "Phan Thiet": { lat: 10.9289, lon: 108.1023, name: "Phan Thiết" },

  // 4 Tỉnh Tây Nguyên
  "Gia Lai": { lat: 13.983, lon: 108.0004, name: "Gia Lai" },
  Pleiku: { lat: 13.9833, lon: 108.0, name: "Pleiku" },
  "Kon Tum": { lat: 14.3545, lon: 108.0, name: "Kon Tum" },
  "Dak Lak": { lat: 12.71, lon: 108.2378, name: "Đắk Lắk" },
  "Buon Ma Thuot": { lat: 12.6675, lon: 108.0378, name: "Buôn Ma Thuột" },
  "Dak Nong": { lat: 12.2646, lon: 107.6098, name: "Đắk Nông" },

  // 4 Tỉnh Đông Nam Bộ
  "Binh Duong": { lat: 11.3254, lon: 106.477, name: "Bình Dương" },
  "Thu Dau Mot": { lat: 10.9804, lon: 106.6519, name: "Thủ Dầu Một" },
  "Dong Nai": { lat: 11.0686, lon: 107.1676, name: "Đồng Nai" },
  "Bien Hoa": { lat: 10.951, lon: 106.823, name: "Biên Hòa" },
  "Ba Ria Vung Tau": { lat: 10.5417, lon: 107.2429, name: "Bà Rịa - Vũng Tàu" },
  "Vung Tau": { lat: 10.346, lon: 107.0843, name: "Vũng Tàu" },
  "Tay Ninh": { lat: 11.3351, lon: 106.0989, name: "Tây Ninh" },

  // 12 Tỉnh Đồng bằng sông Cửu Long
  "Long An": { lat: 10.6956, lon: 106.2431, name: "Long An" },
  "Tien Giang": { lat: 10.4493, lon: 106.342, name: "Tiền Giang" },
  "My Tho": { lat: 10.36, lon: 106.36, name: "Mỹ Tho" },
  "Ben Tre": { lat: 10.2433, lon: 106.3758, name: "Bến Tre" },
  "Tra Vinh": { lat: 9.8127, lon: 106.2992, name: "Trà Vinh" },
  "Vinh Long": { lat: 10.2397, lon: 105.9571, name: "Vĩnh Long" },
  "Dong Thap": { lat: 10.4938, lon: 105.6881, name: "Đồng Tháp" },
  "Cao Lanh": { lat: 10.4603, lon: 105.6327, name: "Cao Lãnh" },
  "An Giang": { lat: 10.5216, lon: 105.1258, name: "An Giang" },
  "Long Xuyen": { lat: 10.3833, lon: 105.4333, name: "Long Xuyên" },
  "Kien Giang": { lat: 10.0125, lon: 105.0808, name: "Kiên Giang" },
  "Rach Gia": { lat: 10.0125, lon: 105.0808, name: "Rạch Giá" },
  "Hau Giang": { lat: 9.7577, lon: 105.6412, name: "Hậu Giang" },
  "Vi Thanh": { lat: 9.7844, lon: 105.4703, name: "Vị Thanh" },
  "Soc Trang": { lat: 9.6025, lon: 105.9739, name: "Sóc Trăng" },
  "Bac Lieu": { lat: 9.294, lon: 105.7215, name: "Bạc Liêu" },
  "Ca Mau": { lat: 9.1769, lon: 105.1524, name: "Cà Mau" },
};

// Danh sách tên 34 tỉnh thành Việt Nam (tiếng Anh -> tiếng Việt)
const vietnameseCityNames = {
  // 5 Thành phố trực thuộc trung ương
  Hanoi: "Hà Nội",
  "Ha Noi": "Hà Nội",
  "Hà Nội": "Hà Nội",

  "Ho Chi Minh City": "Hồ Chí Minh",
  "Ho Chi Minh": "Hồ Chí Minh",
  Saigon: "Sài Gòn",
  "Sài Gòn": "Sài Gòn",
  "Thành phố Hồ Chí Minh": "Hồ Chí Minh",

  "Da Nang": "Đà Nẵng",
  Danang: "Đà Nẵng",
  "Đà Nẵng": "Đà Nẵng",

  "Hai Phong": "Hải Phòng",
  Haiphong: "Hải Phòng",
  "Hải Phòng": "Hải Phòng",

  "Can Tho": "Cần Thơ",
  "Cần Thơ": "Cần Thơ",

  // Miền Bắc (11 tỉnh)
  "Yen Bai": "Yên Bái",
  "Yên Bái": "Yên Bái",
  "Cao Bang": "Cao Bằng",
  "Cao Bằng": "Cao Bằng",

  "Lao Cai": "Lào Cai",
  "Lào Cai": "Lào Cai",

  "Son La": "Sơn La",
  "Sơn La": "Sơn La",

  "Thai Nguyen": "Thái Nguyên",
  "Thái Nguyên": "Thái Nguyên",

  "Quang Ninh": "Quảng Ninh",
  "Quảng Ninh": "Quảng Ninh",
  "Ha Long": "Hạ Long",
  Halong: "Hạ Long",
  "Hạ Long": "Hạ Long",

  "Bac Giang": "Bắc Giang",
  "Bắc Giang": "Bắc Giang",

  "Bac Ninh": "Bắc Ninh",
  "Bắc Ninh": "Bắc Ninh",

  "Hai Duong": "Hải Dương",
  "Hải Dương": "Hải Dương",

  "Thai Binh": "Thái Bình",
  "Thái Bình": "Thái Bình",

  "Nam Dinh": "Nam Định",
  "Nam Định": "Nam Định",

  "Ninh Binh": "Ninh Bình",
  "Ninh Bình": "Ninh Bình",

  // Miền Trung (10 tỉnh)
  "Thanh Hoa": "Thanh Hóa",
  "Thanh Hóa": "Thanh Hóa",

  "Nghe An": "Nghệ An",
  "Nghệ An": "Nghệ An",
  Vinh: "Vinh",

  "Ha Tinh": "Hà Tĩnh",
  "Hà Tĩnh": "Hà Tĩnh",

  "Quang Binh": "Quảng Bình",
  "Quảng Bình": "Quảng Bình",
  "Dong Hoi": "Đồng Hới",

  Hue: "Huế",
  Huế: "Huế",
  "Thua Thien Hue": "Thừa Thiên Huế",
  "Thừa Thiên Huế": "Thừa Thiên Huế",

  "Quang Nam": "Quảng Nam",
  "Quảng Nam": "Quảng Nam",
  "Tam Ky": "Tam Kỳ",
  "Hoi An": "Hội An",

  "Binh Dinh": "Bình Định",
  "Bình Định": "Bình Định",
  "Quy Nhon": "Quy Nhơn",
  "Qui Nhơn": "Quy Nhơn",
  "Quy Nhơn": "Quy Nhơn",

  "Khanh Hoa": "Khánh Hòa",
  "Khánh Hòa": "Khánh Hòa",
  "Nha Trang": "Nha Trang",

  "Lam Dong": "Lâm Đồng",
  "Lâm Đồng": "Lâm Đồng",
  Dalat: "Đà Lạt",
  "Da Lat": "Đà Lạt",
  "Đà Lạt": "Đà Lạt",

  "Binh Thuan": "Bình Thuận",
  "Bình Thuận": "Bình Thuận",
  "Phan Thiet": "Phan Thiết",
  "Phan Thiết": "Phan Thiết",

  // Tây Nguyên (4 tỉnh)
  "Gia Lai": "Gia Lai",
  Pleiku: "Pleiku",

  "Kon Tum": "Kon Tum",

  "Dak Lak": "Đắk Lắk",
  "Đắk Lắk": "Đắk Lắk",
  "Buon Ma Thuot": "Buôn Ma Thuột",
  "Buôn Ma Thuột": "Buôn Ma Thuột",

  "Dak Nong": "Đắk Nông",
  "Đắk Nông": "Đắk Nông",

  // Đông Nam Bộ (4 tỉnh)
  "Binh Duong": "Bình Dương",
  "Bình Dương": "Bình Dương",
  "Thu Dau Mot": "Thủ Dầu Một",

  "Dong Nai": "Đồng Nai",
  "Đồng Nai": "Đồng Nai",
  "Bien Hoa": "Biên Hòa",
  "Biên Hòa": "Biên Hòa",

  "Ba Ria-Vung Tau": "Bà Rịa - Vũng Tàu",
  "Ba Ria - Vung Tau": "Bà Rịa - Vũng Tàu",
  "Vung Tau": "Vũng Tàu",
  "Vũng Tàu": "Vũng Tàu",

  "Tay Ninh": "Tây Ninh",
  "Tây Ninh": "Tây Ninh",

  // Đồng bằng sông Cửu Long (10 tỉnh)
  "Long An": "Long An",

  "Tien Giang": "Tiền Giang",
  "Tiền Giang": "Tiền Giang",
  "My Tho": "Mỹ Tho",
  "Mỹ Tho": "Mỹ Tho",

  "Ben Tre": "Bến Tre",
  "Bến Tre": "Bến Tre",

  "Tra Vinh": "Trà Vinh",
  "Trà Vinh": "Trà Vinh",

  "Vinh Long": "Vĩnh Long",
  "Vĩnh Long": "Vĩnh Long",

  "Dong Thap": "Đồng Tháp",
  "Đồng Tháp": "Đồng Tháp",
  "Cao Lanh": "Cao Lãnh",

  "An Giang": "An Giang",
  "Long Xuyen": "Long Xuyên",
  "Long Xuyên": "Long Xuyên",

  "Kien Giang": "Kiên Giang",
  "Kiên Giang": "Kiên Giang",
  "Rach Gia": "Rạch Giá",
  "Rạch Giá": "Rạch Giá",

  "Hau Giang": "Hậu Giang",
  "Hậu Giang": "Hậu Giang",
  "Vi Thanh": "Vị Thanh",

  "Soc Trang": "Sóc Trăng",
  "Sóc Trăng": "Sóc Trăng",

  "Bac Lieu": "Bạc Liêu",
  "Bạc Liêu": "Bạc Liêu",

  "Ca Mau": "Cà Mau",
  "Cà Mau": "Cà Mau",
};

// Hàm lấy tọa độ từ tên thành phố (sử dụng Geocoding API)
// Hàm lấy tọa độ từ tên thành phố (sử dụng Geocoding API)
async function getCityCoordinates(cityName) {
  try {
    // Bước 1: Thử tìm với "Vietnam"
    let query = `${cityName}, Vietnam`;
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query,
    )}&limit=5&appid=${API_KEY}`;

    let res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
    let data = await res.json();

    // Bước 2: Nếu không tìm thấy, thử tìm global (không có "Vietnam")
    if (data.length === 0) {
      console.log('Không tìm thấy với "Vietnam", thử tìm global...');
      query = cityName;
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query,
      )}&limit=5&appid=${API_KEY}`;

      res = await fetch(url);
      if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
      data = await res.json();
    }

    if (data.length > 0) {
      // Ưu tiên kết quả ở Việt Nam (VN)
      const vnResult = data.find((item) => item.country === "VN");
      if (vnResult) {
        console.log("Tìm thấy thành phố VN:", vnResult);
        return {
          lat: vnResult.lat,
          lon: vnResult.lon,
          name: vnResult.name,
          country: vnResult.country,
        };
      }

      // Nếu không có kết quả VN, lấy kết quả đầu tiên
      console.log("Lấy kết quả đầu tiên:", data[0]);
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        country: data[0].country,
      };
    }

    console.error("Không tìm thấy kết quả nào cho:", cityName);
    return null;
  } catch (error) {
    console.error("getCityCoordinates error:", error);
    return null;
  }
}

// Hàm lấy thời tiết theo tọa độ (lat/lon) - THEO CHUẨN OPENWEATHERMAP
async function fetchWeatherByCoords(lat, lon, displayName = null) {
  try {
    loading.classList.remove("hide");
    weatherData.classList.add("hide");

    // Sử dụng API với lat/lon như trong tài liệu
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data = await res.json();
    console.log("API DATA:", data);

    currentTempC = data.main.temp;
    updateTemperature();

    // Xác định tên hiển thị
    let finalName = displayName || data.name;

    // Nếu là thành phố Việt Nam (country === "VN"), chuyển sang tiếng Việt
    if (data.sys.country === "VN" && !displayName) {
      finalName = vietnameseCityNames[data.name] || data.name;
    }

    cityName.textContent = finalName;
    countryCode.textContent = data.sys.country;
    tempCelsius.textContent = Math.round(data.main.temp) + "°C";
    tempFahrenheit.textContent =
      Math.round((data.main.temp * 9) / 5 + 32) + "°F";

    const weatherIconCode = data.weather[0].icon;
    weatherIcon.textContent = weatherIcons[weatherIconCode] || "🌤️";
    weatherDesc.textContent = data.weather[0].description;

    humidity.textContent = data.main.humidity + "%";
    windSpeed.textContent = (data.wind.speed * 3.6).toFixed(1) + " km/h";
    pressure.textContent = data.main.pressure + " hPa";
    visibility.textContent = (data.visibility / 1000).toFixed(1) + " km";

    // ⭐ QUAN TRỌNG: Thay đổi video background theo thời tiết
    updateBackgroundVideo(weatherIconCode);

    loading.classList.add("hide");
    weatherData.classList.remove("hide");
  } catch (error) {
    console.error("fetchWeatherByCoords error:", error);
    loading.classList.add("hide");
    alert("Không thể lấy dữ liệu thời tiết. Vui lòng thử lại!");
  }
}

// Hàm lấy thời tiết theo tên thành phố
async function fetchWeather(city) {
  const searchCity = city.trim();

  // Chuẩn hóa tên thành phố (loại bỏ dấu, chuyển chữ thường)
  const normalizedCity = searchCity
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  // Tìm trong danh sách tọa độ có sẵn (case-insensitive)
  let foundCity = null;
  for (const [key, value] of Object.entries(cityCoordinates)) {
    const normalizedKey = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    if (normalizedKey.toLowerCase() === normalizedCity.toLowerCase()) {
      foundCity = { key, ...value };
      break;
    }
  }

  if (foundCity) {
    // Tìm thấy trong danh sách có sẵn
    console.log("Tìm thấy trong danh sách local:", foundCity);
    const { lat, lon, name } = foundCity;
    await fetchWeatherByCoords(lat, lon, name);
  } else {
    // Không tìm thấy, sử dụng Geocoding API
    console.log("Tìm kiếm trên Geocoding API cho:", searchCity);
    const coords = await getCityCoordinates(searchCity);
    if (coords) {
      await fetchWeatherByCoords(coords.lat, coords.lon);
    } else {
      loading.classList.add("hide");
      alert(
        `Không tìm thấy thành phố: "${searchCity}"\n\nVui lòng kiểm tra lại tên thành phố hoặc thử tên tiếng Anh.`,
      );
    }
  }
}

function updateTime() {
  const now = new Date();
  currentTime.textContent = now.toLocaleTimeString("vi-VN");
  currentDate.textContent = now.toLocaleDateString("vi-VN");
}
setInterval(updateTime, 1000);
updateTime();

function updateTemperature() {
  const celsius = currentTempC;
  const fahrenheit = (celsius * 9) / 5 + 32;

  if (isCelsius) {
    tempCelsius.textContent = Math.round(celsius) + "°C";
    tempFahrenheit.textContent = Math.round(fahrenheit) + "°F";
  } else {
    tempCelsius.textContent = Math.round(fahrenheit) + "°F";
    tempFahrenheit.textContent = Math.round(celsius) + "°C";
  }
}

toggleUnit.addEventListener("click", () => {
  isCelsius = !isCelsius;
  slider.classList.toggle("right");
  celsiusBtn.classList.toggle("active");
  fahrenheitBtn.classList.toggle("active");
  updateTemperature();
});

// Search functionality
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && search.value.trim()) {
    fetchWeather(search.value.trim());
    search.value = "";
  }
});

// Navigation cities
navCities.forEach((city) => {
  city.addEventListener("click", () => {
    navCities.forEach((c) => c.classList.remove("active"));
    city.classList.add("active");
    fetchWeather(city.dataset.city);
  });
});

fetchWeather("Ho Chi Minh City");

document.addEventListener("DOMContentLoaded", () => {
  const weatherInfo = document.querySelector(".weather-info");

  if (weatherInfo) {
    weatherInfo.addEventListener("click", () => {
      const city = document.getElementById("cityName").textContent.trim();
      const targetUrl = `../page_info/index-2.html?city=${encodeURIComponent(city)}`;

      const mainContainer = document.querySelector(".container");
      if (mainContainer) {
        mainContainer.classList.add("slide-out-left");
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    });
  }
});
