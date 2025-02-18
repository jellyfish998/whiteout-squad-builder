import React from 'react';

const RatioSliders = ({ desiredRatio, onRatioChange }) => {

    const handleRatioChange = (type, value) => {
        const newRatio = parseFloat(value);

        // Prevent invalid input
        if (isNaN(newRatio) || newRatio < 0) {
            return;
        }

        //Create a copy of the ratio object.
        const newRatios = { ...desiredRatio, [type]: newRatio };

        // Calculate the remaining value to distribute among other types
        const remainingValue = 1 - Object.values(newRatios).reduce((sum, r) => sum + r, 0);

        // Get types other than the one being changed, these will be adjusted
        const otherTypes = Object.keys(desiredRatio).filter((t) => t !== type);

        // Only adjust if value is less than one.
        if(Object.values(newRatios).reduce((sum, r) => sum + r, 0) <= 1)
        {
            // Distribute the remaining value proportionally among other types
            const numOtherTypes = otherTypes.length;
            for(const otherType of otherTypes)
            {
                newRatios[otherType] = desiredRatio[otherType] + (remainingValue/numOtherTypes)
            }
        }

        onRatioChange(newRatios);
    };

    return (
        <div className="input-group">
            <h3>Desired Ratios</h3>
            {Object.entries(desiredRatio).map(([type, ratio]) => (
                <div key={type} className="slider-group">
                    <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
                    <input
                        type="range"
                        id={type}
                        min="0"
                        max="1"
                        step="0.01"
                        value={ratio}
                        onChange={(e) => handleRatioChange(type, e.target.value)}
                    />
                    <span>{(ratio * 100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};

export default RatioSliders;