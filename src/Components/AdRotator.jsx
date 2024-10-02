import { useState } from "react"
import "./AdRotator.css"
import { ads } from "../utils/adData"
import { useAdRotation } from "../utils/adRotatorUtils"

function AdRotator() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useAdRotation(ads.length, setCurrentAdIndex)

  return (
    <div className="ad-rotator-container">
      <img
        src={ads[currentAdIndex]}
        alt={`Ad ${currentAdIndex + 1}`}
        className="ad-img"
      />
    </div>
  )
}

export default AdRotator