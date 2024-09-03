import { useState, useEffect } from "react";
import "./AdRotatorHorizontal.css";
import AdHorizontal70Off from "../assets/Ad-horizontal-70.png";
import AdHorizontalReach from "../assets/Ad-horizontal-reach.png";

function AdRotatorHorizontal() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const ads = [AdHorizontal70Off, AdHorizontalReach];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="ad-horizontal-container">
      <img
        src={ads[currentAdIndex]}
        alt={`Ad ${currentAdIndex + 1}`}
        className="ad-horizontal-img"
      />
    </div>
  );
}

export default AdRotatorHorizontal;
