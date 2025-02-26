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
  return ICONS[apiIcon];
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

  const toggleUnit = () => {
    const newUnit = unit === "imperial" ? "metric" : "imperial";
    setUnit(newUnit);
    fetchWeather(city, newUnit);
  };

  return (
    <div className="Weather">
      <div className="container">
        <form onSubmit={handleSearch} className="row mb-4">
          <div className="col-9">
            <input
              type="search"
              name="cityInput"
              className="form-control"
              placeholder="Enter a city.."
              required
            />
          </div>
          <div className="col-3 p-0">
            <button type="submit" className="btn w-100 submit-btn">
              Search
            </button>
          </div>
        </form>
      </div>

      {ready && (
        <>
          <div className="weather-info container">
            <div className="row current-weather mb-4">
              <div className="col-6 conditions">
                <h1>{city}</h1>
                <ul>
                  <li>
                    Last Updated:
                    <strong>
                      {" "}
                      <FormattedDate date={weather.date} />
                    </strong>
                  </li>
                  <li>
                    Condition: <strong>{weather.description}</strong>
                  </li>
                  <li>
                    Humidity:{""} <strong>{weather.humidity}%</strong>
                  </li>
                  <li>
                    Wind:{" "}
                    <strong>
                      {weather.wind} {unit === "imperial" ? "mph" : "km/h"}
                    </strong>
                  </li>
                </ul>
              </div>

              <div className="col-6 d-flex justify-content-end">
                <div className="text-center">
                  <ReactAnimatedWeather
                    icon={weather.icon}
                    color="#383852"
                    size={64}
                    animate={true}
                  />
                </div>
                <div className="temperature">
                  <h2 className="temperature-value m-0 p-0">
                    {weather.temperature}
                    <span className="temperature-unit">
                      °{unit === "imperial" ? "F" : "C"}
                    </span>{" "}
                  </h2>

                  <button
                    className="btn toggle-btn text-decoration-none m-0 p-0"
                    onClick={toggleUnit}
                  >
                    Switch to {""}
                    {unit === "imperial" ? "°C" : "°F"}
                  </button>
                </div>
              </div>
            </div>

            <div className="row text-center justify-content-evenly forecast text-nowrap mt-3 mb-2 p-2">
              {forecast.map((day, index) => (
                <div key={index} className="col">
                  <h5>
                    {new Date(day.time * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </h5>
                  <ReactAnimatedWeather
                    icon={getIcon(day.condition.icon)}
                    color="#444049"
                    size={44}
                    animate={true}
                  />
                  <p>
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
          </div>
        </>
      )}
    </div>
  );
}
