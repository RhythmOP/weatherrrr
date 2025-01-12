let weather = {
  apiKey: "f7a29db5ec30b6b27b83fb5a4983a5fb",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchUVIndex(data.coord.lat, data.coord.lon);
        this.fetchAirQuality(data.coord.lat, data.coord.lon);
      });
  },
  fetchWeatherByCoordinates: function (latitude, longitude) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchUVIndex(latitude, longitude);
        this.fetchAirQuality(latitude, longitude);
      });
  },
  fetchUVIndex: function (latitude, longitude) {
    fetch(
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".uv-index").innerText = "UV Index: " + data.value;
      });
  },
  fetchAirQuality: function (latitude, longitude) {
    fetch(
      "https://api.openweathermap.org/data/2.5/air_pollution?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => {
        const aqi = data.list[0].main.aqi;
        document.querySelector(".air-quality").innerText = "Air Quality Index: " + aqi;
      });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
  geolocate: function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        alert("Unable to retrieve your location");
      }
    );
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

// Auto-detect and fetch weather for current location on load
weather.geolocate();

// Set default location to Amravati, Maharashtra
weather.fetchWeather("Amravati, Maharashtra");
