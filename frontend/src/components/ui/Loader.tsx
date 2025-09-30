import React, { useEffect, useState } from "react";
import "./loader.css";

interface LoaderProps {
  duration?: number; // milliseconds
}

const Loader: React.FC<LoaderProps> = ({ duration = 5000 }) => {
  const [zoomOut, setZoomOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setZoomOut(true);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={`loader-container ${zoomOut ? "zoom-out" : ""}`}>
      <h1 className="loader">HackMate</h1>
    </div>
  );
};

export default Loader;
