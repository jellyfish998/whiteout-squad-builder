import React from 'react';

const MarchSizeInputs = ({ numSquads, marchSizes, onNumSquadsChange, onMarchSizeChange }) => {
    // Ensure marchSizes is always an array to prevent crashes
    if (!Array.isArray(marchSizes)) {
        marchSizes = Array(numSquads).fill(135410);
    }

    return (
        <div className="input-group">
            <h3>March Sizes</h3>
            <label>Number of Squads:</label>
            <input
                type="number"
                value={numSquads}
                min="1"
                onChange={(e) => onNumSquadsChange(parseInt(e.target.value) || 1)}
            />

            <div className="march-size-list">
                {marchSizes.map((size, index) => (
                    <div key={index} className="march-size-item">
                        <label>Squad {index + 1} March Size:</label>
                        <input
                            type="number"
                            value={size}
                            min="0"
                            onChange={(e) => onMarchSizeChange(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarchSizeInputs;
