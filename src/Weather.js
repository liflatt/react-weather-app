import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactAnimatedWeather from "react-animated-weather";
import Footer from "./Footer";
import FormattedDate from "./FormattedDate";
import "./Weather.css";

const ICONS = {
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

function getIcon(apiIcon) {
  return ICONS[apiIcon] || "CLEAR_DAY";
}

export default function Weather({
  defaultCity = "Dallas",
  defaultUnit = "imperial",
}) {
  const [city, setCity] = useState(defaultCity);
  const [unit, setUnit] = useState(defaultUnit);
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [ready, setReady] = useState(false);

  const fetchWeather = useCallback((cityQuery, unit) => {
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
            description: current.data.condition.description.replace(
              /\b\w/g,
              (char) => char.toUpperCase()
            ),
            humidity: current.data.temperature.humidity,
            wind: current.data.wind.speed,
            date: new Date(current.data.time * 1000),
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
  }, []);

  useEffect(() => {
    fetchWeather(defaultCity, defaultUnit);
  }, [defaultCity, defaultUnit, fetchWeather]);

  const handleSearch = (event) => {
    event.preventDefault();
    const inputCity = event.target.elements.cityInput.value.trim();
    if (!inputCity) return alert("Please enter a city");
    fetchWeather(inputCity, unit);
  };

  const toggleUnit = (event) => {
    event.preventDefault();
    const newUnit = unit === "imperial" ? "metric" : "imperial";
    setUnit(newUnit);
    fetchWeather(city, newUnit);
  };

  return (
    <div className="Weather">
      <form onSubmit={handleSearch} className="row g-3 mb-4">
        <div className="col-8 col-md-9">
          <input
            type="search"
            name="cityInput"
            className="form-control"
            placeholder="Enter a city..."
            required
          />
        </div>
        <div className="col-4 col-md-3">
          <button type="submit" className="btn w-100 submit-btn">
            Search
          </button>
        </div>
      </form>

      {ready && (
        <>
          <div className="row align-items-center p-2">
            <div className="col-md-6 text-center text-md-start">
              <h1 className="display-4">{city}</h1>
              <ul className="list-unstyled">
                <li>
                  <strong>Last Updated:</strong>{" "}
                  <FormattedDate date={weather.date} />
                </li>
                <li>
                  <strong>Condition:</strong> {weather.description}
                </li>
                <li>
                  <strong>Humidity:</strong> {weather.humidity}%
                </li>
                <li>
                  <strong>Wind:</strong> {weather.wind}{" "}
                  {unit === "imperial" ? "mph" : "km/h"}
                </li>
              </ul>
            </div>
            <div className="col-md-6 d-flex flex-column align-items-center mt-4 mb-2 p-2">
              <ReactAnimatedWeather
                icon={weather.icon}
                color="#27252c"
                size={72}
                animate={true}
              />
              <h2 class="mb-0 mt-1">
                {weather.temperature}
                <span className="unit">°{unit === "imperial" ? "F" : "C"}</span>
              </h2>

              <a
                href="/"
                className="toggle-btn text-center text-decoration-none"
                onClick={toggleUnit}
                rel="noopener noreferrer"
              >
                Switch to {unit === "imperial" ? "°C" : "°F"}
              </a>
            </div>
          </div>

          <div className="row text-center align-items-center justify-content-between forecast mt-2 mb-2">
            {forecast.map((day, index) => (
              <div key={index} className="col align-items-center">
                <h5>
                  {new Date(day.time * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </h5>
                <ReactAnimatedWeather
                  icon={getIcon(day.condition.icon)}
                  color="#27252c"
                  size={44}
                  animate={true}
                />
                <p class="forecast-temps">
                  <span className="temp-max">
                    <strong>{Math.round(day.temperature.maximum)}°</strong>
                  </span>{" "}
                  /{" "}
                  <span className="temp-min">
                    {Math.round(day.temperature.minimum)}°
                  </span>
                </p>
              </div>
            ))}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
