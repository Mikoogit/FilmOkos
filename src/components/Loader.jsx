import React from "react";
import "../styles/Loader.css";

export default function Loader() {
  return (
    <div className="loader">
      <div className="reel">
        <div className="hole"></div>
      </div>
      <div className="loading-text">Betöltés...</div>
    </div>
  );
}
