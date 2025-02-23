import React from "react";

export default function Footer() {
  return (
    <div className="Footer">
      <footer className="border-top pt-3 text-center">
        <p>
          Coded by{" "}
          <a
            href="https://github.com/liflatt"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lindsey Flatt
          </a>
          , open-sourced{" "}
          <a
            href="https://github.com/liflatt/react-weather-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            on GitHub
          </a>
          , and {""}
          <a
            href="https://react-weather-app-by-lindsey-flatt.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            hosted on Netlify
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
