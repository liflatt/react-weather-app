import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactAnimatedWeather from "react-animated-weather";
import Footer from "./Footer";

export default function Weather({
  defaultCity = "Dallas",
  defaultUnit = "imperial",
}) {
  const [city, setCity] = useState(defaultCity);
  const [unit, setUnit] = useState(defaultUnit);
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line
  useEffect(() => {
    fetchWeather(defaultCity, defaultUnit);
  }, []);

  // eslint-disable-next-line

  const fetchWeather = (cityQuery, unit) => {
    const apiKey = "b0452f91cd75631eoba398t0f42a2100";
    const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${cityQuery}&key=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityQuery}&key=${apiKey}&units=${unit}`;

    axios
      .all([axios.get(currentUrl), axios.get(forecastUrl)])
      .then(
        axios.spread((current, forecastData) => {
          setCity(current.data.city);
          setWeather({
            temperature: Math.round(current.data.temperature.current),
            // Inline capitalization of the description
            description: current.data.condition.description.replace(
              /\b\w/g,
              (char) => char.toUpperCase()
            ),
            humidity: current.data.temperature.humidity,
            wind: current.data.wind.speed,
            icon: getIcon(current.data.condition.icon),
          });
          setForecast(forecastData.data.daily.slice(0, 5));
          setReady(true);
        })
      )
      .catch((error) => {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather data. Please try again.");
      });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const inputCity = event.target.elements.cityInput.value.trim();
    if (!inputCity) return alert("Please enter a city");
    fetchWeather(inputCity, unit);
  };

  const toggleUnit = () => {
    const newUnit = unit === "imperial" ? "metric" : "imperial";
    setUnit(newUnit);
    fetchWeather(city, newUnit);
  };

  const getIcon = (apiIcon) => {
    const icons = {
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
    return icons[apiIcon] || "CLOUDY";
  };

  return (
    <div className="Weather mt-5 p-4 rounded shadow-lg bg-light">
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
        <>
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>{city}</h1>
              <p>
                {new Date().toLocaleString()},{" "}
                <span className="text-primary">{weather.description}</span>
                <br />
                Humidity: <strong>{weather.humidity}%</strong>, Wind:{" "}
                <strong>
                  {weather.wind} {unit === "imperial" ? "mph" : "km/h"}
                </strong>
              </p>
            </div>
            <div className="col-md-6 text-end current-weather-icon">
              <ReactAnimatedWeather
                icon={weather.icon}
                color="#1e1e1e"
                size={64}
                animate={true}
              />
              <h2 className="fw-bold display-4 current-weather-temperature">
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

          <div className="row mt-4 text-center">
            {forecast.map((day, index) => (
              <div key={index} className="col">
                <h5>
                  {new Date(day.time * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </h5>
                <ReactAnimatedWeather
                  icon={getIcon(day.condition.icon)}
                  color="#1e1e1e"
                  size={50}
                  animate={true}
                />
                <p>
                  <strong>{Math.round(day.temperature.maximum)}°</strong> /{" "}
                  {Math.round(day.temperature.minimum)}°
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
