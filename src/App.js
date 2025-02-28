import React from "react";
import "./App.css";
import Weather from "./Weather";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Weather defaultCity="Dallas" defaultUnit="imperial" />
      </div>
    </div>
  );
}

export default App;
