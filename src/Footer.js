import React from "react";

export default function Footer() {
  return (
    <div className="Footer">
      <footer>
        <p>
          Coded by{" "}
          <a
            href="https://github.com/liflatt"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lindsey Flatt
          </a>
          , open-sourced on{" "}
          <a
            href="https://github.com/liflatt/react-weather-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            GitHub
          </a>
          , and hosted on {""}
          <a
            href="https://react-weather-app-by-lindsey-flatt.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Netlify
          </a>
        </p>
      </footer>
    </div>
  );
}
