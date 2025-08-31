const apiKey = "ec2082908ac9c0e1dc1e612df2ad1641";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchbox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const bgVideo = document.getElementById("bgVideo");
const themeSelect = document.getElementById("theme");

async function checkWeather(city){
  const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
  if(response.status == 404){
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();

    // Basic Info
    document.querySelector(".city").innerHTML = `${data.name}, ${data.sys.country}`;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".feels-like").innerHTML = "Feels like: " + Math.round(data.main.feels_like) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    // Date & Time
    let now = new Date();
    document.querySelector(".datetime").innerHTML = now.toLocaleString();

    // Sunrise & Sunset
    let sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.querySelector(".sunrise").innerHTML = "🌅 Sunrise: " + sunrise;
    document.querySelector(".sunset").innerHTML = "🌇 Sunset: " + sunset;

    // Map link
    document.querySelector(".map").href = `https://www.google.com/maps/search/?api=1&query=${data.coord.lat},${data.coord.lon}`;

    // Set Weather Icon & Video
    let mainWeather = data.weather[0].main.toLowerCase();
    weatherIcon.src = `images/${mainWeather}.png`;

    if(themeSelect.value === "auto"){
      if(mainWeather === "clear"){
        document.body.className = "";
        bgVideo.src = "videos/clear.mp4";
      } else if(mainWeather === "rain" || mainWeather === "drizzle"){
        document.body.className = "night-theme";
        bgVideo.src = "videos/rain.mp4";
      } else if(mainWeather === "clouds"){
        document.body.className = "dark-theme";
        bgVideo.src = "videos/clouds.mp4";
      } else if(mainWeather === "mist"){
        document.body.className = "night-theme";
        bgVideo.src = "videos/mist.mp4";
      }
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

    getForecast(city);
  }
}

async function getForecast(city){
  const response = await fetch(`${forecastUrl}${city}&appid=${apiKey}`);
  const data = await response.json();

  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.forEach(day => {
    let date = new Date(day.dt * 1000);
    let options = { weekday: 'short', month: 'short', day: 'numeric' };
    let dayName = date.toLocaleDateString(undefined, options);

    forecastEl.innerHTML += `
      <div class="forecast-card">
        <p>${dayName}</p>
        <img src="images/${day.weather[0].main.toLowerCase()}.png" alt="">
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });
}

// Event Listeners
searchBtn.addEventListener("click", ()=> checkWeather(searchbox.value));

themeSelect.addEventListener("change", () => {
  const theme = themeSelect.value;
  document.body.classList.remove("light-theme","dark-theme","night-theme");
  if(theme === "light") document.body.classList.add("light-theme");
  else if(theme === "dark") document.body.classList.add("dark-theme");
  else if(theme === "night") document.body.classList.add("night-theme");
  else checkWeather(searchbox.value);
});
