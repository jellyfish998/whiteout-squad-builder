// src/components/SquadBuilder.jsx
import React, { useState } from 'react';
import TroopInputs from './TroopInputs';
import MarchSizeInputs from './MarchSizeInputs';
import RallyCallerInput from './RallyCallerInput';
import SquadTable from './SquadTable';
import TroopTotals from './TroopTotals';
import RatioSliders from './RatioSliders';
import RallyCallerCalculator from './RallyCallerCalculator';
import AdjustedRatioDisplay from './AdjustedRatioDisplay';

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
        setDesiredRatio(newRatios);
    };

    const handleNumSquadsChange = (value) => {
        const newNumSquads = parseInt(value) || 0;
        if (newNumSquads > 0)
        {
            setNumSquads(newNumSquads);

            setMarchSizes(prevSizes => {
                const newSizes = [...prevSizes];
                const effectiveNumSquads = isRallyCaller ? newNumSquads + 1 : newNumSquads;

                 if (effectiveNumSquads > prevSizes.length) {
                    const toAdd = effectiveNumSquads - prevSizes.length;
                    if(isRallyCaller && prevSizes.length === numSquads) {
                        newSizes.unshift(...Array(toAdd).fill(0));
                    }
                    else{
                       newSizes.push(...Array(toAdd).fill(0));
                    }

                } else if (effectiveNumSquads < prevSizes.length) {
                     if(isRallyCaller && prevSizes.length > newNumSquads + 1) {
                       newSizes.length = effectiveNumSquads;
                     } else if(!isRallyCaller){
                         newSizes.length = effectiveNumSquads;
                     }
                }
                return newSizes;
            });
            setSquads([]);
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
                newSizes.unshift(0);
              } else {
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
        setAdjustedRatios({}); // Reset

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
        let remainingTroops = JSON.parse(JSON.stringify(totalTroops)); // Deep copy

        // --- 2. Rally Caller Squad (Conditional) ---
        let rallyCallerIndex = -1;
        if (isRallyCaller) {
            rallyCallerIndex = 0;
            const rallyCallerSquad = {};
            for (const type in remainingTroops) {
                rallyCallerSquad[type] = [];
                let troopsToAllocate = Math.floor(marchSizes[0] * desiredRatio[type]);
                const sortedTroopLevels = [...remainingTroops[type]].sort((a, b) => {
                    if (b.sequence !== a.sequence) {
                        return b.sequence - a.sequence;
                    }
                    return b.level - a.level;
                });

                for (const levelData of sortedTroopLevels) {
                    const troopsToUse = Math.min(troopsToAllocate, levelData.count);
                    if (troopsToUse > 0) {
                        rallyCallerSquad[type].push({ level: levelData.level, count: troopsToUse });
                    }
                    troopsToAllocate -= troopsToUse;
                    levelData.count -= troopsToUse;
                    if (troopsToAllocate <= 0) break;
                }
                if (troopsToAllocate > 0) {
                    setError(`Not enough ${type} troops for the Rally Caller squad.`);
                    return;
                }
            }
            calculatedSquads.push(rallyCallerSquad);
        }

        // --- 3. Adjusted Ratio Calculation (Delegated to Component) ---
        const { adjRatio, error: adjustedRatioError } = AdjustedRatioCalculator({
            totalTroops,
            desiredRatio,
            marchSizes,
            isRallyCaller,
            remainingTroops,
        });

        if (adjustedRatioError) {
            setError(adjustedRatioError);
            return;
        }

        setAdjustedRatios(adjRatio); // Update state for display

        // --- 4. Build the User-Defined Squads ---
        let totalMarchSize = 0; // Now calculate total march size *here*.
        const startIndex = isRallyCaller ? 1 : 0;
        for (let i = startIndex; i < marchSizes.length; i++) {
            totalMarchSize += marchSizes[i];
        }

        for (let i = startIndex; i < numSquads + startIndex; i++) {
          const squad = {};
            for (const type in remainingTroops) {
                squad[type] = [];
                let troopsToAllocate = Math.floor(marchSizes[i] * adjRatio[type]);

                const sortedTroopLevels = [...remainingTroops[type]].sort((a, b) => {
                    if (b.sequence !== a.sequence) {
                        return b.sequence - a.sequence;
                    }
                    return b.level - a.level;
                });

                for (const levelData of sortedTroopLevels) {
                    const troopsToUse = Math.min(troopsToAllocate, levelData.count);
                    if (troopsToUse > 0) {
                        squad[type].push({ level: levelData.level, count: troopsToUse });
                    }
                    troopsToAllocate -= troopsToUse;
                    levelData.count -= troopsToUse;
                    if (troopsToAllocate <= 0) break;
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
        setSquads(calculatedSquads); // This was also out of order! Update squads *last*.
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
                {/* Correctly render AdjustedRatioCalculator and pass props */}
                <AdjustedRatioDisplay
                    totalTroops={totalTroops}
                    desiredRatio={desiredRatio}
                    marchSizes={marchSizes}
                    isRallyCaller={isRallyCaller}
                    remainingTroops={remainingTroops}
                />
                {isRallyCaller && (
                    <RallyCallerCalculator
                        marchSize={marchSizes[0]}
                        desiredRatio={desiredRatio}
                        totalTroops={totalTroops}
                    />
                )}
                <SquadTable squads={squads} isRallyCaller={isRallyCaller}/>
                <TroopTotals totalRequiredTroops={totalRequiredTroops} additionalTroopsRequired={additionalTroopsRequired} />
            </div>
        </div>
    );
};

export default SquadBuilder