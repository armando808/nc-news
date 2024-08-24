import { useState, useEffect } from "react";
import "./AdRotator.css";
import Ad70Off from "../assets/Ad-70-off.png";
import AdReachPeople from "../assets/Ad-reach-people.png";

function AdRotator() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const ads = [Ad70Off, AdReachPeople];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="ad-rotator-container">
      <img
        src={ads[currentAdIndex]}
        alt={`Ad ${currentAdIndex + 1}`}
        className="ad-img"
      />
    </div>
  );
}

export default AdRotator;
