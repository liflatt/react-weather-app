export default function Footer() {
  return (
    <div className="Footer">
      <footer className="row justify-content-center mt-4">
        <p className="text-center col-md-8">
          Coded by
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
          , and{" "}
          <a
            href="https://react-weather-app-by-lindsey-flatt.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            hosted on Netlify
          </a>
        </p>
      </footer>
    </div>
  );
}
