import React from 'react';
const AdjustedRatioDisplay = ({adjustedRatios, desiredRatio}) => {

  return (
        <div className="input-group">
            <h3>Adjusted Ratios</h3>
             {Object.entries(adjustedRatios).map(([type, ratio]) => (
                <div key={type} className="slider-group">
                    <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
                     <div className="slider-container">
                        <div className="slider-bar-desired" style={{ width: `${desiredRatio[type] * 100}%` }}></div>
                        <div className="slider-bar-adjusted" style={{ width: `${ratio * 100}%` }}></div>
                    </div>
                    <span>{(ratio * 100).toFixed(0)}%</span>
                </div>
            ))}
        </div>

  )
}

export default AdjustedRatioDisplay;