import React from 'react';

const AdjustedRatioCalculator = ({ totalTroops, desiredRatio, remainingTroops, onAdjustedRatios }) => {
    const calculateAdjustedRatios = () => {
        let availableTroopsByType = {};
        let totalAvailableTroops = 0;

        for (const type in remainingTroops) {
            availableTroopsByType[type] = remainingTroops[type].reduce((sum, troop) => sum + troop.count, 0);
            totalAvailableTroops += availableTroopsByType[type];
        }

        if (totalAvailableTroops === 0) {
            return { adjustedRatios: {}, error: "No troops available for allocation." };
        }

        let minScalingFactor = Infinity;
        for (const type in desiredRatio) {
            if (desiredRatio[type] > 0 && availableTroopsByType[type] > 0) {
                let availableRatio = availableTroopsByType[type] / totalAvailableTroops;
                minScalingFactor = Math.min(minScalingFactor, availableRatio / desiredRatio[type]);
            }
        }

        let adjustedRatios = {};
        let totalScaledRatio = 0;
        for (const type in desiredRatio) {
            adjustedRatios[type] = (desiredRatio[type] * minScalingFactor);
            totalScaledRatio += adjustedRatios[type];
        }

        for (const type in adjustedRatios) {
            adjustedRatios[type] = adjustedRatios[type] / totalScaledRatio;
        }

        onAdjustedRatios(adjustedRatios);
        return { adjustedRatios, error: null };
    };

    const { adjustedRatios, error } = calculateAdjustedRatios();

    return (
        <div>
            <h3>Adjusted Ratios</h3>
            {error ? <p className="error">{error}</p> :
                <ul>
                    {Object.entries(adjustedRatios).map(([type, ratio]) => (
                        <li key={type}>{type}: {(ratio * 100).toFixed(2)}%</li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default AdjustedRatioCalculator;
