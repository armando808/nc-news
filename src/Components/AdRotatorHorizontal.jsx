import { useState } from "react"
import "./AdRotatorHorizontal.css"
import { horizontalAds } from "../utils/adData"
import { useAdRotation } from "../utils/adRotatorUtils"

function AdRotatorHorizontal() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useAdRotation(horizontalAds.length, setCurrentAdIndex)

  return (
    <div className="ad-horizontal-container">
      <img
        src={horizontalAds[currentAdIndex]}
        alt={`Ad ${currentAdIndex + 1}`}
        className="ad-horizontal-img"
      />
    </div>
  )
}

export default AdRotatorHorizontal