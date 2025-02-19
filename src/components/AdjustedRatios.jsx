import React from 'react';

const AdjustedRatios = ({ adjustedRatios }) => {
  if (!adjustedRatios || Object.keys(adjustedRatios).length === 0) {
    return null; // Don't render anything if adjustedRatios is empty
  }

  return (
    <div className="input-group">
        <h3>Adjusted Ratios</h3>
         <p>
            Infantry: {adjustedRatios.infantry?.toFixed(2) || 0},&nbsp;
            Lancer: {adjustedRatios.lancer?.toFixed(2) || 0},&nbsp;
            Marksman: {adjustedRatios.marksman?.toFixed(2) || 0}
        </p>
    </div>

  );
};

export default AdjustedRatios;