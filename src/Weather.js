import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactAnimatedWeather from "react-animated-weather";

export default function WeatherApp() {
  const [city, setCity] = useState("Dallas");
  const [unit, setUnit] = useState("imperial");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    searchCity(city, unit);
  }, [city, unit]);

  function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.elements.cityInput.value.trim();
    if (!searchInput) return alert("Please enter a city");
    setCity(searchInput);
  }

  function searchCity(city, unit) {
    const apiKey = "b0452f91cd75631eoba398t0f42a2100";
    const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${unit}`;

    axios.all([axios.get(apiUrl), axios.get(forecastUrl)]).then(
      axios.spread((weatherRes, forecastRes) => {
        setWeather({
          temperature: Math.round(weatherRes.data.temperature.current),
          description: capitalizeWords(weatherRes.data.condition.description),
          humidity: weatherRes.data.temperature.humidity,
          wind: weatherRes.data.wind.speed,
          icon: mapWeatherIcon(weatherRes.data.condition.icon),
        });
        setForecast(forecastRes.data.daily.slice(0, 5));
        setReady(true);
      })
    );
  }

  function toggleUnit() {
    setUnit((prevUnit) => (prevUnit === "imperial" ? "metric" : "imperial"));
  }

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
        <>
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="fw-bold">{city}</h1>
              <p>
                <span>{new Date().toLocaleString()}</span>,
                <span className="text-primary"> {weather.description}</span>
                <br />
                Humidity: <strong>{weather.humidity}%</strong>, Wind:{" "}
                <strong>
                  {weather.wind} {unit === "imperial" ? "mph" : "km/h"}
                </strong>
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

          <div className="row mt-4 text-center">
            {forecast.map((day, index) => (
              <div key={index} className="col">
                <h5>
                  {new Date(day.time * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </h5>
                <ReactAnimatedWeather
                  icon={mapWeatherIcon(day.condition.icon)}
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
