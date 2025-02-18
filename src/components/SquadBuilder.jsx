import React, { useState } from 'react';
import TroopInputs from './TroopInputs';
import MarchSizeInputs from './MarchSizeInputs';
import RallyCallerInput from './RallyCallerInput';
import SquadTable from './SquadTable';
import TroopTotals from './TroopTotals';
import RatioInputs from './RatioInputs';
import RallyCallerCalculator from './RallyCallerCalculator'; // Import - but we won't render it directly

const SquadBuilder = () => {
    const [totalTroops, setTotalTroops] = useState({
        infantry: [{ level: 1, count: 338682, sequence: 3 }],
        lancer: [{ level: 1, count: 374057, sequence: 2 }],
        marksman: [{ level: 1, count: 447556, sequence: 1 }],
    });
    const [desiredRatio, setDesiredRatio] = useState({
        infantry: 0.1,
        lancer: 0.1,
        marksman: 0.8,
    });

    const [numSquads, setNumSquads] = useState(6);
    const [marchSizes, setMarchSizes] = useState(Array(numSquads).fill(135410));
    const [squads, setSquads] = useState([]);
    const [error, setError] = useState('');
    const [isRallyCaller, setIsRallyCaller] = useState(true);
    const [totalRequiredTroops, setTotalRequiredTroops] = useState(0);
    const [additionalTroopsRequired, setAdditionalTroopsRequired] = useState({});
    const [adjustedRatios, setAdjustedRatios] = useState({});


  const handleTroopChange = (type, newTroopLevels) => {
    setTotalTroops({ ...totalTroops, [type]: newTroopLevels });
  };

    const handleRatioChange = (newRatios) => {
        //Sets the desired Ratio, to the new ratios
        setDesiredRatio(newRatios);
    };

    const handleNumSquadsChange = (value) => {
        const newNumSquads = parseInt(value) || 0;
        if (newNumSquads > 0)
        {
            setNumSquads(newNumSquads);

            setMarchSizes(prevSizes => {
                const newSizes = [...prevSizes];
                const effectiveNumSquads = isRallyCaller ? newNumSquads + 1 : newNumSquads; // Account for rally caller

                 if (effectiveNumSquads > prevSizes.length) {
                    const toAdd = effectiveNumSquads - prevSizes.length;
                    // Add to beginning if rally caller, otherwise to end.
                    if(isRallyCaller && prevSizes.length === numSquads) { //was equal to old value of num squads
                        newSizes.unshift(...Array(toAdd).fill(0));
                    }
                    else{
                       newSizes.push(...Array(toAdd).fill(0));
                    }

                } else if (effectiveNumSquads < prevSizes.length) {
                     if(isRallyCaller && prevSizes.length > newNumSquads + 1) {
                       //remove elements to keep proper length.
                       newSizes.length = effectiveNumSquads;
                     } else if(!isRallyCaller){
                         newSizes.length = effectiveNumSquads; // Truncate
                     }
                }
                return newSizes;
            });
            setSquads([]); //Clear to prevent display errors.
            setError('');
        } else {
             setError('Number of Squads Must be a positive Number')
        }
    };
    const handleMarchSizeChange = (index, value) => {
        const newMarchSizes = [...marchSizes];
        const intValue = parseInt(value) || 0;
        if (intValue < 0) {
            setError(`Invalid march size for Squad ${index + 1}. Must be non-negative.`);
            return;
        }
        newMarchSizes[index] = intValue;
        setMarchSizes(newMarchSizes);
        setError('');
    };

    const handleRallyCallerChange = (event) => {
        const isChecked = event.target.checked;
        setIsRallyCaller(isChecked);
         setMarchSizes(prevSizes => {
            const newSizes = [...prevSizes];
              if (isChecked) {
                // Add a new march size at the beginning.
                newSizes.unshift(0);
              } else {
                // Remove the first march size.
                newSizes.shift();
              }
              return newSizes;
        });
        setSquads([]); // Clear when rally caller changes.
        setError('');
    };

    const calculateSquads = () => {
        setError('');
        setSquads([]);
        setAdjustedRatios({}); // Reset adjusted ratios - keep for display.

        // --- 1. Input Validation ---
        const totalRatio = Object.values(desiredRatio).reduce((sum, r) => sum + r, 0);
        if (Math.abs(totalRatio - 1) > 0.001) {
            setError("Desired ratios must sum to approximately 1.");
            return;
        }
        if (numSquads <= 0) {
            setError("Number of squads must be greater than 0.");
            return;
        }
        for (const size of marchSizes) {
            if (size < 0) {
                setError("March sizes cannot be negative.");
                return;
            }
        }

        const calculatedSquads = [];
       // Create a copy of totalTroops to work with
        let remainingTroops = {};
        for (const type in totalTroops) {
            remainingTroops[type] = [...totalTroops[type].map(level => ({ ...level }))];
        }

        // --- 2. Rally Caller Squad (Conditional) ---
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
                        setError(`Not enough ${type} troops for the Rally Caller squad.`);
                        return; // Stop if not enough troops.
                    }
            }

            calculatedSquads.push(rallyCallerSquad);
        }

        // --- 3. Adjusted Ratio Calculation (Corrected) ---
        let totalMarchSize = 0;
        const startIndex = isRallyCaller ? 1 : 0;
        for (let i = startIndex; i < marchSizes.length; i++) {
            totalMarchSize += marchSizes[i];
        }

        const adjRatio = {};
         // Initialize adjRatio for all troop types
        for (const type in totalTroops) {
            adjRatio[type] = 0;
        }
        let remainingMarchCapacity = totalMarchSize;
       //Create local copy for calculations.
         let localRemainingTroops = {};
        for (const type in remainingTroops) {
            localRemainingTroops[type] = remainingTroops[type].reduce((sum, level) => sum + level.count, 0);
        }

        // *** CORRECTED ADJUSTED RATIO LOGIC ***
        //sort troops
        const allTroopTypes = Object.keys(totalTroops);
        const sortedSequence = allTroopTypes.sort((typeA, typeB) => {
            // Find the highest sequence number for each troop type
            const highestSequenceA = remainingTroops[typeA].reduce((maxSeq, troop) => Math.max(maxSeq, troop.sequence), 0);
            const highestSequenceB = remainingTroops[typeB].reduce((maxSeq, troop) => Math.max(maxSeq, troop.sequence), 0);
            return highestSequenceB - highestSequenceA; // Sort in descending order
        });
        for (const troopType of sortedSequence) {
            let allocated = Math.min(localRemainingTroops[troopType], remainingMarchCapacity);
            adjRatio[troopType] = totalMarchSize > 0 ? allocated / totalMarchSize : 0; // Avoid division by zero.

            remainingMarchCapacity -= allocated; //update remaining capacity
            localRemainingTroops[troopType] -= allocated; //update local remaining troops.
        }


        // --- 4. Build the User-Defined Squads ---
        for (let i = startIndex; i < numSquads + startIndex; i++) {
            const squad = {};
            for (const type in remainingTroops) {
                squad[type] = [];
                let troopsToAllocate = Math.floor(marchSizes[i] * adjRatio[type]);

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
                        squad[type].push({level: levelData.level, count: troopsToUse});
                    }
                    troopsToAllocate -= troopsToUse;
                    levelData.count -= troopsToUse;
                    if (troopsToAllocate <= 0) break; // Optimization
                }
            }
            calculatedSquads.push(squad);
        }

        // --- 5. Calculate Total Required and Additional Troops ---
        let totalRequired = 0;
        for (let i = startIndex; i < marchSizes.length; i++) {
            totalRequired += marchSizes[i];
        }
        setTotalRequiredTroops(totalRequired);

        const additionalRequired = {};
         for (const type in totalTroops) {
            additionalRequired[type] = [];
             let requiredForSquads = 0;
            for(let squad of calculatedSquads){
                if(Array.isArray(squad[type])){
                    for(let level of squad[type]){
                        requiredForSquads+= level.count;
                    }
                } else {
                    requiredForSquads += squad[type];
                }
            }

            let remainingTypeTroops = totalTroops[type].reduce((sum, level) => sum + level.count, 0);

            if (requiredForSquads > remainingTypeTroops) {
                additionalRequired[type] = requiredForSquads - remainingTypeTroops
            } else {
                additionalRequired[type] = 0;
            }
        }
        setAdditionalTroopsRequired(additionalRequired);

        // --- 6. Update State (Correct Order) ---
        setAdjustedRatios(adjRatio); // for display
        setSquads(calculatedSquads);
    };



    return (
        <div className="squad-builder">
            <h2>Whiteout Survival Squad Builder</h2>
            {error && <div className="error">{error}</div>}
            <div className="input-section">
                <h3>Inputs</h3>
                <RallyCallerInput isRallyCaller={isRallyCaller} onRallyCallerChange={handleRallyCallerChange} />
                <MarchSizeInputs
                    numSquads={numSquads}
                    marchSizes={marchSizes}
                    isRallyCaller={isRallyCaller}
                    onNumSquadsChange={handleNumSquadsChange}
                    onMarchSizeChange={handleMarchSizeChange}
                />
                <RatioSliders desiredRatio={desiredRatio} onRatioChange={handleRatioChange} />
                <TroopInputs
                    totalTroops={totalTroops}
                    onTroopChange={handleTroopChange}
                />


                <button onClick={calculateSquads}>Calculate Squads</button>
            </div>

            <div className="results-section">
                <h3>Adjusted Ratios</h3>
                <p>
                    Infantry: {adjustedRatios.infantry?.toFixed(2) || 0},&nbsp;
                    Lancer: {adjustedRatios.lancer?.toFixed(2) || 0},&nbsp;
                    Marksman: {adjustedRatios.marksman?.toFixed(2) || 0}
                </p>
                <SquadTable squads={squads} isRallyCaller={isRallyCaller}/>
                <TroopTotals totalRequiredTroops={totalRequiredTroops} additionalTroopsRequired={additionalTroopsRequired} />
            </div>
        </div>
    );
};

export default SquadBuilder;