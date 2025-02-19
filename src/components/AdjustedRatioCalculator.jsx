import React from 'react';

const AdjustedRatioCalculator = ({ totalTroops, desiredRatio, marchSizes, isRallyCaller }) => {

    const calculateAdjustedRatios = () => {
        // --- 1. Input Validation (Keep this here for consistency) ---
        const totalRatio = Object.values(desiredRatio).reduce((sum, r) => sum + r, 0);
        if (Math.abs(totalRatio - 1) > 0.001) {
            return { error: "Desired ratios must sum to approximately 1.", adjRatio: {} };
        }

        // --- 2. Calculate Total March Size (Excluding Rally Caller) ---
        let totalMarchSize = 0;
        const startIndex = isRallyCaller ? 1 : 0;
        for (let i = startIndex; i < marchSizes.length; i++) {
            totalMarchSize += marchSizes[i];
        }
        // --- 3. Prepare Remaining Troops (Deep Copy!) ---
        let remainingTroops = {};
        for (const type in totalTroops) {
            remainingTroops[type] = [...totalTroops[type].map(level => ({ ...level }))];
        }
          // --- 4. Remove troops for rally caller ---
          let rallyCallerIndex = -1;
        if (isRallyCaller) {
            rallyCallerIndex = 0;
            const rallyCallerSquad = {};
            for (const type in remainingTroops) {
                rallyCallerSquad[type] = []; // Initialize as array
                let troopsToAllocate = Math.floor(marchSizes[0] * desiredRatio[type]);
                 // Sort troop levels by sequence (higher levels first, based on sequence object)
                const sortedTroopLevels = [...remainingTroops[type]].sort((a, b) => {
                    if (b.sequence !== a.sequence) {
                        return b.sequence - a.sequence; // Highest sequence first
                    } else {
                        return b.level - a.level;     // Highest level first
                    }
                });

                for (const levelData of sortedTroopLevels) {
                    const troopsToUse = Math.min(troopsToAllocate, levelData.count);
                    if(troopsToUse > 0){
                        rallyCallerSquad[type].push({level: levelData.level, count: troopsToUse});
                    }
                    troopsToAllocate -= troopsToUse;
                    levelData.count -= troopsToUse; // Deduct from the copied remainingTroops
                    if (troopsToAllocate <= 0) break;
                }
                  if (troopsToAllocate > 0) {
                         return { error: `Not enough ${type} troops for the Rally Caller squad.`, adjRatio: {} };
                    }
            }
        }

        // --- 5. Adjusted Ratio Calculation (CORRECTED) ---
        const adjRatio = {};
        let remainingMarchCapacity = totalMarchSize;

        let localRemainingTroops = {};
        for (const type in remainingTroops) {
          localRemainingTroops[type] = remainingTroops[type].reduce((sum, level) => sum + level.count, 0);
        }
        //sort troops
        const allTroopTypes = Object.keys(totalTroops);
        const sortedSequence = allTroopTypes.sort((typeA, typeB) => {
            // Find the highest sequence number for each troop type
            const highestSequenceA = totalTroops[typeA].reduce((maxSeq, troop) => Math.max(maxSeq, troop.sequence), 0);
            const highestSequenceB = totalTroops[typeB].reduce((maxSeq, troop) => Math.max(maxSeq, troop.sequence), 0);
            return highestSequenceB - highestSequenceA; // Sort in descending order
        });

        // Initialize adjRatio *before* the loop
        for (const type of allTroopTypes) {
            adjRatio[type] = 0;
        }

        for (const troopType of sortedSequence) {
              // Calculate DESIRED troops based on total march size and desired ratio
            let desiredTroops = Math.floor(totalMarchSize * desiredRatio[troopType]);
            // Allocate the *minimum* of desired, remaining (of that type), and remaining capacity
            let allocated = Math.min(desiredTroops, localRemainingTroops[troopType], remainingMarchCapacity);

            adjRatio[troopType] = totalMarchSize > 0 ? allocated / totalMarchSize : 0;

            remainingMarchCapacity -= allocated;
            localRemainingTroops[troopType] -= allocated;
        }

        return { adjRatio, error: null }; // Return calculated ratios and no error
    };

    const { adjRatio, error } = calculateAdjustedRatios();


    return (
       <div className="input-group">
            <h3>Adjusted Ratios</h3>
            {error ? (
                <p className="error">{error}</p>
            ) : (
              <p>
                  Infantry: {adjRatio.infantry?.toFixed(2) || 0},&nbsp;
                  Lancer: {adjRatio.lancer?.toFixed(2) || 0},&nbsp;
                  Marksman: {adjRatio.marksman?.toFixed(2) || 0}
              </p>
            )}
        </div>
    );
};

export default AdjustedRatioCalculator;