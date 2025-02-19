import React from 'react';

const MarchSizeInputs = ({ numSquads, marchSizes, isRallyCaller, onNumSquadsChange, onMarchSizeChange }) => {
  return (
    <div className="input-group">
      <label htmlFor="numSquads">Number of Squads:</label>
      <input
        type="number"
        id="numSquads"
        value={numSquads}
        onChange={(e) => onNumSquadsChange(e.target.value)}
        min="1"
      />
      <div className="march-sizes-container">
        <h3>March Sizes</h3>
        {marchSizes.slice(0, isRallyCaller ? numSquads + 1 : numSquads).map((size, index) => {
          let label = `Squad ${index + 1}`;
          if (isRallyCaller && index === 0) {
            label = "Squad 1 (Rally Caller)";
          } else if (isRallyCaller) {
            label = `Squad ${index}`;
          }
          return (
            <div key={index} className="march-size-input">
              <label htmlFor={`marchSize-${index}`}>{label}</label>
              <input
                type="number"
                id={`marchSize-${index}`}
                value={size}
                onChange={(e) => onMarchSizeChange(index, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarchSizeInputs;