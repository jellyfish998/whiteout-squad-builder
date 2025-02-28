import React from 'react';

const AdjustedRatioCalculator = ({ totalTroops, desiredRatio, marchSizes, isRallyCaller, remainingTroops }) => {

    //This is now a pure function, no longer in the component.
    const calculateAdjustedRatios = (totalTroops, desiredRatio, marchSizes, isRallyCaller, remainingTroops) => {
        // --- 1. Input Validation (Keep this for consistency) ---
        const totalRatio = Object.values(desiredRatio).reduce((sum, r) => sum + r, 0);
        if (Math.abs(totalRatio - 1) > 0.001) {
            return { adjRatio: {}, error: "Desired ratios must sum to approximately 1." };
        }

        // --- 2. Calculate Total March Size (Excluding Rally Caller) ---
        let totalMarchSize = 0;
        const startIndex = isRallyCaller ? 1 : 0;
        for (let i = startIndex; i < marchSizes.length; i++) {
            totalMarchSize += marchSizes[i];
        }
        // --- 3. Prepare Remaining Troops (Deep Copy!) ---
        //This is handled in squad builder

          // --- 4. Remove troops for rally caller ---
          // This is handled in the squad builder

        // --- 5. Adjusted Ratio Calculation (CORRECTED) ---
        const adjRatio = {};
        let remainingMarchCapacity = totalMarchSize;

        let localRemainingTroops = {};
        for (const type in remainingTroops) {
            localRemainingTroops[type] = remainingTroops[type].reduce((sum, level) => sum + level.count, 0); // Sum all levels
        }
        //sort troops
        const allTroopTypes = Object.keys(totalTroops);
        const sortedSequence = allTroopTypes.sort((typeA, typeB) => {
            // Find the highest sequence number for each troop type
            const highestSequenceA = totalTroops[typeA].reduce((maxSeq, troop) => Math.max(maxSeq, troop.sequence), 0);
            const highestSequenceB = totalTroops[typeB].reduce((maxSeq, troop) => Math.max(maxSeq, troop.sequence), 0);
            return highestSequenceB - highestSequenceA; // Sort in descending order
        });

        // Initialize adjRatio for all troop types
        for (const type of allTroopTypes) {
            adjRatio[type] = 0;
        }

        for (const troopType of sortedSequence) {
              // Calculate DESIRED troops based on total march size and desired ratio
            let desiredTroops = Math.floor(totalMarchSize * desiredRatio[troopType]);
            // Allocate the *minimum* of desired troops, remaining troops, and remaining capacity
            let allocated = Math.min(desiredTroops, localRemainingTroops[troopType], remainingMarchCapacity);

            adjRatio[troopType] = totalMarchSize > 0 ? allocated / totalMarchSize : 0;

            remainingMarchCapacity -= allocated;
            localRemainingTroops[troopType] -= allocated;
        }

        return { adjRatio, error: null }; // Return an object containing adjustedRatios, and error.
    };

    const { adjRatio, error } = calculateAdjustedRatios(totalTroops, desiredRatio, marchSizes, isRallyCaller, remainingTroops);


    return (
        <div className="input-group">
            <h3>Adjusted Ratios</h3>
            {error ? (
                <p className="error">{error}</p>
            ) : (
              Object.entries(adjRatio).map(([type, ratio]) => (
                <div key={type} className="slider-group">
                    <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
                     <div className="slider-container">
                        <div className="slider-bar-desired" style={{ width: `${desiredRatio[type] * 100}%` }}></div>
                        <div className="slider-bar-adjusted" style={{ width: `${ratio * 100}%` }}></div>
                    </div>
                    <span>{(ratio * 100).toFixed(0)}%</span>
                </div>
            ))
            )}
        </div>
    );
};

export default AdjustedRatioCalculator;