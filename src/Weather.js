import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactAnimatedWeather from "react-animated-weather";

export default function WeatherApp() {
  const [city, setCity] = useState("Dallas");
  const [unit, setUnit] = useState("imperial");
  const [weather, setWeather] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    searchCity("Dallas");
  }, []);

  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.elements.cityInput.value.trim();
    if (!searchInput) {
      alert("Please enter a city");
      return;
    }
    setCity(searchInput);
    searchCity(searchInput);
  }

  function searchCity(city) {
    const apiKey = "b0452f91cd75631eoba398t0f42a2100";
    const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;

    axios.get(apiUrl).then((response) => {
      setWeather({
        temperature: Math.round(response.data.temperature.current),
        description: capitalizeWords(response.data.condition.description),
        humidity: response.data.temperature.humidity,
        wind: response.data.wind.speed,
        icon: mapWeatherIcon(response.data.condition.icon),
      });
      setReady(true);
    });
  }

  function toggleUnit() {
    setUnit(unit === "imperial" ? "metric" : "imperial");
  }

  function mapWeatherIcon(apiIcon) {
    const iconMapping = {
      "clear-sky-day": "CLEAR_DAY",
      "clear-sky-night": "CLEAR_NIGHT",
      "few-clouds-day": "PARTLY_CLOUDY_DAY",
      "few-clouds-night": "PARTLY_CLOUDY_NIGHT",
      "scattered-clouds-day": "PARTLY_CLOUDY_DAY",
      "scattered-clouds-night": "PARTLY_CLOUDY_NIGHT",
      "broken-clouds-day": "CLOUDY",
      "broken-clouds-night": "CLOUDY",
      "shower-rain-day": "RAIN",
      "shower-rain-night": "RAIN",
      "rain-day": "RAIN",
      "rain-night": "RAIN",
      "thunderstorm-day": "RAIN",
      "thunderstorm-night": "RAIN",
      "snow-day": "SNOW",
      "snow-night": "SNOW",
      "mist-day": "FOG",
      "mist-night": "FOG",
    };
    return iconMapping[apiIcon] || "CLOUDY";
  }

  return (
    <div className="container weather-app mt-5 p-4 rounded shadow-lg bg-light">
      <header className="mb-4 border-bottom pb-3">
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-8">
            <input
              type="search"
              name="cityInput"
              className="form-control"
              placeholder="Enter a city.."
              required
            />
          </div>
          <div className="col-4">
            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </div>
        </form>
      </header>

      {ready && (
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="fw-bold">{city}</h1>
            <p>
              <span>{new Date().toLocaleString()}</span>,
              <span className="text-primary"> {weather.description}</span>
              <br />
              Humidity: <strong>{weather.humidity}%</strong>, Wind:{" "}
              <strong>{weather.wind} mph</strong>
            </p>
          </div>
          <div className="col-md-6 text-center">
            <ReactAnimatedWeather
              icon={weather.icon}
              color="#1e1e1e"
              size={64}
              animate={true}
            />
            <h2 className="fw-bold display-4">
              {weather.temperature}°
              <span>{unit === "imperial" ? "F" : "C"}</span>
            </h2>
            <button
              className="btn btn-link text-decoration-none"
              onClick={toggleUnit}
            >
              Switch to {unit === "imperial" ? "°C" : "°F"}
            </button>
          </div>
        </div>
      )}

      <footer className="border-top pt-3 text-center">
        <p>
          Coded by <a href="https://github.com/liflatt">Lindsey Flatt</a>,
          open-sourced
          <a href="https://github.com/liflatt/react-weather-app"> on GitHub</a>,
          and
          <a href="https://lf-weather.netlify.app/"> hosted on Netlify</a>.
        </p>
      </footer>
    </div>
  );
}
