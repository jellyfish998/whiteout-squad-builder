// src/components/AdjustedRatioCalculator.jsx
import React, { useState } from 'react';

const AdjustedRatioCalculator = ({ totalTroops, desiredRatio, sequence, marchSizes, isRallyCaller }) => {

    const [adjustedRatios, setAdjustedRatios] = useState({});
    const [error, setError] = useState('');

    const calculateAdjustedRatios = () => {
        setError(''); // Clear previous errors.
        console.log("--- Starting Adjusted Ratio Calculation ---");

        // --- 1. Input Validation (Important for consistency) ---
        const totalRatio = Object.values(desiredRatio).reduce((sum, r) => sum + r, 0);
        if (Math.abs(totalRatio - 1) > 0.001) {
            setError("Desired ratios must sum to approximately 1.");
            setAdjustedRatios({}); // Clear on error
            return;
        }

        // --- 2. Calculate Total March Size (Excluding Rally Caller) ---
        let totalMarchSize = 0;
        const startIndex = isRallyCaller ? 1 : 0;
        for (let i = startIndex; i < marchSizes.length; i++) {
            totalMarchSize += marchSizes[i];
        }
        console.log("Total March Size (excluding Rally Caller):", totalMarchSize);

        // --- 3. Prepare Remaining Troops (Deep Copy!) ---
        let remainingTroops = {};
         for (const type in totalTroops) {
             remainingTroops[type] = totalTroops[type].reduce((sum, level) => sum + level.count, 0);
        }

        console.log("Remaining Troops:", remainingTroops);

        // --- 4. Adjusted Ratio Calculation (Core Logic) ---
        const sortedSequence = Object.entries(sequence).sort(([, a], [, b]) => a - b);
        const adjRatio = {};
        let remainingMarchCapacity = totalMarchSize;


        // Initialize adjRatio for all troop types
        for (const type in totalTroops) {
            adjRatio[type] = 0;
        }

        // *** CORRECTED ADJUSTED RATIO LOGIC ***
        for (const [troopType, seqValue] of sortedSequence) {
            console.log(`Calculating Adjusted Ratio for: ${troopType} (Sequence: ${seqValue})`);

            // Calculate allocated troops based on available troops and remaining capacity
            let allocated = Math.min(remainingTroops[troopType], remainingMarchCapacity);
            adjRatio[troopType] = totalMarchSize > 0 ? allocated / totalMarchSize : 0;

            remainingMarchCapacity -= allocated; //update variables.
            remainingTroops[troopType] -= allocated;

            console.log(`  Allocated: ${allocated}`);
            console.log(`  Adjusted Ratio[${troopType}]: ${adjRatio[troopType]}`);
            console.log(`  Remaining March Capacity: ${remainingMarchCapacity}`);
            console.log(`  Remaining Troops:`, remainingTroops);
        }
        setAdjustedRatios(adjRatio);
        console.log("--- Adjusted Ratio Calculation Complete ---");
        console.log("Final Adjusted Ratios:", adjRatio);
    };


    return (
        <div>
            <h3>Adjusted Ratios (Isolated)</h3>
            {error && <div className="error">{error}</div>}
            <button onClick={calculateAdjustedRatios}>Calculate Adjusted Ratios</button>
            <div>
               <p>
                    Infantry: {adjustedRatios.infantry?.toFixed(4) || 0},&nbsp;
                    Lancer: {adjustedRatios.lancer?.toFixed(4) || 0},&nbsp;
                    Marksman: {adjustedRatios.marksman?.toFixed(4) || 0}
                </p>
            </div>
        </div>
    );
};

export default AdjustedRatioCalculator;