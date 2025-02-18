import React, { useState } from "react";
import axios from "axios";

export default function Weather() {
  const [city, setCity] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [weather, setWeatherData] = useState({});
  const [lastSearchedCity, setLastSearchedCity] = useState(""); // New state for header

  // Helper function to capitalize each word
  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function showWeather(response) {
    setLoaded(true);
    setWeatherData({
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (city.trim() === "") {
      alert("Please enter a city.");
      return;
    }

    // Set the formatted city for display
    setLastSearchedCity(capitalizeWords(city));

    let apiKey = "d1a86552de255334f6117b348c4519bd";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(showWeather)
      .finally(() => {
        setCity(""); // Clear input field after search
      });
  }

  function updateCity(event) {
    setCity(event.target.value);
  }

  if (loaded) {
    return (
      <div className="Search">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-9">
              <input
                type="search"
                value={city}
                placeholder="Enter a city"
                className="form-control search-input"
                onChange={updateCity}
              />
            </div>
            <div className="col-3 p-0">
              <button type="submit">Search</button>
            </div>
          </div>
        </form>
        {/* Show this header only when there is a last searched city */}
        {lastSearchedCity && <h2>Current weather in {lastSearchedCity}</h2>}
        <ul>
          <li>Temperature: {weather.temperature}°C</li>
          <li>Description: {weather.description}</li>
          <li>Humidity: {weather.humidity}%</li>
          <li>Wind: {weather.wind} km/h</li>
          <li>
            <img src={weather.icon} alt={weather.description} />
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div className="Weather">
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            onChange={updateCity}
            value={city}
            placeholder="Enter a city"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    );
  }
}
