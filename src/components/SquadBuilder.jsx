import React, { useState } from 'react';
import TroopInputs from './TroopInputs';
import MarchSizeInputs from './MarchSizeInputs';
import RallyCallerInput from './RallyCallerInput';
import SquadTable from './SquadTable';
import TroopTotals from './TroopTotals';
import AdjustedRatios from './AdjustedRatios';
import RatioInputs from './RatioInputs';
import RallyCallerCalculator from './RallyCallerCalculator';

const SquadBuilder = () => {
    const [totalTroops, setTotalTroops] = useState({
        infantry: [{ level: 1, count: 338682 }],
        lancer: [{ level: 1, count: 374057 }],
        marksman: [{ level: 1, count: 447556 }],
    });
    const [desiredRatio, setDesiredRatio] = useState({
        infantry: 0.1,
        lancer: 0.1,
        marksman: 0.8,
    });
    const [sequence, setSequence] = useState({
        infantry: 3,
        lancer: 2,
        marksman: 1,
    });

    const [numSquads, setNumSquads] = useState(6);
    const [marchSizes, setMarchSizes] = useState(Array(numSquads).fill(135410));
    const [squads, setSquads] = useState([]);
    const [error, setError] = useState('');
    const [isRallyCaller, setIsRallyCaller] = useState(true);
    const [totalRequiredTroops, setTotalRequiredTroops] = useState(0);
    const [additionalTroopsRequired, setAdditionalTroopsRequired] = useState({});
    const [adjustedRatios, setAdjustedRatios] = useState({}); //keep for display


  const handleTroopChange = (type, newTroopLevels) => {
    setTotalTroops({ ...totalTroops, [type]: newTroopLevels });
  };

    const handleRatioChange = (type, value) => {
        const ratio = parseFloat(value);
        if (isNaN(ratio) || ratio < 0 || ratio > 1) {
            setError(`Invalid ratio for ${type}.  Must be between 0 and 1`);
            return;
        }
        setDesiredRatio({ ...desiredRatio, [type]: ratio });
        setError('');
    };

    const handleSequenceChange = (type, value) => {
        const seq = parseInt(value)
        if (isNaN(seq) || seq < 1) {
            setError(`Invalid sequence, must be a positive number`);
            return;
        }
        setSequence({ ...sequence, [type]: parseInt(value) || 0 });
        setError('');
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
        setAdjustedRatios({}); // Reset adjusted ratios

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
                rallyCallerSquad[type] = 0; // Initialize
                let troopsToAllocate = Math.floor(marchSizes[0] * desiredRatio[type]);
                 // Sort troop levels by sequence (higher levels first, based on sequence object)
                const sortedTroopLevels = [...remainingTroops[type]].sort((a, b) => sequence[type] - sequence[type]);

                for (const levelData of sortedTroopLevels) {
                    const troopsToUse = Math.min(troopsToAllocate, levelData.count);
                    rallyCallerSquad[type] += troopsToUse;
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

        const sortedSequence = Object.entries(sequence).sort(([, a], [, b]) => a - b);
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
        for (const [troopType, seqValue] of sortedSequence) {
            let allocated = Math.min(localRemainingTroops[troopType], remainingMarchCapacity);
            adjRatio[troopType] = totalMarchSize > 0 ? allocated / totalMarchSize : 0; // Avoid division by zero.

            remainingMarchCapacity -= allocated; //update remaining capacity
            localRemainingTroops[troopType] -= allocated; //update local remaining troops.
        }

        setAdjustedRatios(adjRatio);

        // --- 4. Build the User-Defined Squads ---
        for (let i = startIndex; i < numSquads + startIndex; i++) {
            const squad = {};
            for (const type in remainingTroops) {
                squad[type] = 0;
                let troopsToAllocate = Math.floor(marchSizes[i] * adjRatio[type]);

                const sortedTroopLevels = [...remainingTroops[type]].sort((a, b) => sequence[type] - sequence[type]);
                for (const levelData of sortedTroopLevels) {
                    const troopsToUse = Math.min(troopsToAllocate, levelData.count);
                    squad[type] += troopsToUse;
                    troopsToAllocate -= troopsToUse;
                    levelData.count -= troopsToUse;
                    if (troopsToAllocate <= 0) break; // Optimization
                }
            }
            calculatedSquads.push(squad);
        }

        setSquads(calculatedSquads);

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
                requiredForSquads += squad[type];
            }

            let remainingTypeTroops = totalTroops[type].reduce((sum, level) => sum + level.count, 0);

            if (requiredForSquads > remainingTypeTroops) {
                additionalRequired[type] = requiredForSquads - remainingTypeTroops
            } else {
                additionalRequired[type] = 0;
            }
        }
        setAdditionalTroopsRequired(additionalRequired);
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
                <RatioInputs desiredRatio={desiredRatio} onRatioChange={handleRatioChange} />
                <TroopInputs
                    totalTroops={totalTroops}
                    sequence={sequence}
                    onTroopChange={handleTroopChange}
                    onSequenceChange={handleSequenceChange}
                />


                <button onClick={calculateSquads}>Calculate Squads</button>
            </div>

            <div className="results-section">
                <h3>Adjusted Ratios</h3>
                <p>
                    Infantry: {adjRatio.infantry?.toFixed(4) || 0},&nbsp;
                    Lancer: {adjRatio.lancer?.toFixed(4) || 0},&nbsp;
                    Marksman: {adjRatio.marksman?.toFixed(4) || 0}
                </p>
                {isRallyCaller && (
                    <RallyCallerCalculator
                        marchSize={marchSizes[0]}
                        desiredRatio={desiredRatio}
                        totalTroops={totalTroops}
                        sequence={sequence}
                    />
                )}
                <SquadTable squads={squads} isRallyCaller={isRallyCaller}/>
                <TroopTotals totalRequiredTroops={totalRequiredTroops} additionalTroopsRequired={additionalTroopsRequired} />
            </div>
        </div>
    );
};

export default SquadBuilder;