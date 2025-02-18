import React, { useState } from 'react';

const SquadBuilder = () => {
    const [totalTroops, setTotalTroops] = useState({
        infantry: 338682,
        lancer: 374057,
        marksman: 447556,
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
    const [marchSizes, setMarchSizes] = useState(Array(numSquads).fill(135410)); // Initial value.
    const [squads, setSquads] = useState([]);
    const [error, setError] = useState('');
    const [isRallyCaller, setIsRallyCaller] = useState(true);
    const [totalRequiredTroops, setTotalRequiredTroops] = useState(0);
    const [additionalTroopsRequired, setAdditionalTroopsRequired] = useState({});
    const [adjustedRatios, setAdjustedRatios] = useState({}); // Store adjusted ratios

    const handleTroopChange = (type, value) => {
        setTotalTroops({ ...totalTroops, [type]: parseInt(value) || 0 });
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

        console.log("--- Starting Calculation ---");
        console.log("Initial Total Troops:", totalTroops);
        console.log("Desired Ratios:", desiredRatio);
        console.log("Sequence:", sequence);
        console.log("Number of Squads:", numSquads);
        console.log("March Sizes:", marchSizes);
        console.log("Is Rally Caller:", isRallyCaller);

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
        let remainingTroops = { ...totalTroops };

        // --- 2. Rally Caller Squad (Conditional) ---
        let rallyCallerIndex = -1;
        if (isRallyCaller) {
            rallyCallerIndex = 0;
            const rallyCallerSquad = {};
            for (const type in totalTroops) {
                rallyCallerSquad[type] = Math.floor(marchSizes[0] * desiredRatio[type]);
                remainingTroops[type] -= rallyCallerSquad[type];
                if (remainingTroops[type] < 0) {
                    setError(`Not enough ${type} troops for the Rally Caller squad.`);
                    return;
                }
            }
            calculatedSquads.push(rallyCallerSquad);
            console.log("Rally Caller Squad:", rallyCallerSquad);
        }

        console.log("Remaining Troops (after Rally Caller):", remainingTroops);


        // --- 3. Adjusted Ratio Calculation (Corrected *Again*) ---

        // Calculate total march size *excluding* the rally caller's march size.
        let totalMarchSize = 0;
        const startIndex = isRallyCaller ? 1 : 0;  // Start at index 1 if rally, 0 if not.

        for (let i = startIndex; i < marchSizes.length; i++) {
            totalMarchSize += marchSizes[i];
        }

        console.log("Total March Size (excluding Rally Caller):", totalMarchSize);


        const sortedSequence = Object.entries(sequence).sort(([, a], [, b]) => a - b);
        const adjRatio = {};
        let remainingMarchCapacity = totalMarchSize; // CORRECTED VARIABLE NAME
        let localRemainingTroops = { ...remainingTroops }; //copy for local calculations.

        // *Precise* Adjusted Ratio Calculation (following spreadsheet logic)
         for (const [troopType] of sortedSequence) {
            adjRatio[troopType] = 0; // Initialize
         }

        // *** CORRECTED ADJUSTED RATIO LOGIC ***
        for (const [troopType, seqValue] of sortedSequence) {
            console.log(`Calculating Adjusted Ratio for: ${troopType} (Sequence: ${seqValue})`);

            // Calculate allocated troops (analogous to MIN)
            let allocated = Math.min(localRemainingTroops[troopType], remainingMarchCapacity);

            // Calculate the adjusted ratio
            adjRatio[troopType] = totalMarchSize > 0 ? allocated / totalMarchSize : 0;  // Avoid division by zero
            console.log(`allocated ${allocated}`);
            // Update remaining troops and capacity
            remainingMarchCapacity -= allocated;
            localRemainingTroops[troopType] -= allocated;

            console.log(`  Adjusted Ratio[${troopType}]: ${adjRatio[troopType]}`);
            console.log(`  Remaining March Capacity: ${remainingMarchCapacity}`);
            console.log(`  Local Remaining Troops:`, localRemainingTroops);
        }
        setAdjustedRatios(adjRatio); // Store for display
        console.log("Final Adjusted Ratios:", adjRatio);

        // --- 4. Build the User-Defined Squads ---
         for (let i = startIndex; i < numSquads + startIndex; i++) { // Iterate through user squads
            const squad = {};
            console.log(`Calculating Squad ${i + 1}:`)
            for (const type in totalTroops) {
                squad[type] = Math.floor(marchSizes[i] * adjRatio[type]);
                squad[type] = Math.min(squad[type], remainingTroops[type]);  // Don't exceed available.
                remainingTroops[type] -= squad[type]; // Deduct troops.
                console.log(`  ${type}: ${squad[type]}`);

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
             let requiredForSquads = 0;
            for (const squad of calculatedSquads) {
                requiredForSquads += squad[type];
            }
             additionalRequired[type] = Math.max(0, requiredForSquads - totalTroops[type]);
         }
        setAdditionalTroopsRequired(additionalRequired);
        console.log("--- Calculation Complete ---")
    };



    return (
        <div className="squad-builder">
            <h2>Whiteout Survival Squad Builder</h2>
            {error && <div className="error">{error}</div>}
            <div className="input-section">
                <h3>Inputs</h3>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isRallyCaller}
                            onChange={handleRallyCallerChange}
                        />
                        Rally Caller
                    </label>
                </div>
                <div>
                    <label>Number of Squads:</label>
                    <input
                        type="number"
                        value={numSquads}
                        onChange={(e) => handleNumSquadsChange(e.target.value)}
                        min="1"
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Troop Type</th>
                            <th>Total Troops</th>
                            <th>Desired Ratio</th>
                            <th>Sequence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(totalTroops).map((type) => (
                            <tr key={type}>
                                <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={totalTroops[type]}
                                        onChange={(e) => handleTroopChange(type, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={desiredRatio[type]}
                                        onChange={(e) => handleRatioChange(type, e.target.value)}
                                        min="0"
                                        max="1"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={sequence[type]}
                                        onChange={(e) => handleSequenceChange(type, e.target.value)}
                                        min="1"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>March Sizes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Squad</th>
                            <th>March Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marchSizes.slice(0, isRallyCaller ? numSquads + 1 : numSquads).map((size, index) => {
                            let label = `Squad ${index + 1}`;
                             if (isRallyCaller && index === 0) {
                                label = "Squad 1 (Rally Caller)";
                            } else if (isRallyCaller) {
                                label = `Squad ${index}`;//offset the index.
                            }
                            return (
                                <tr key={index}>
                                    <td>{label}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={size}
                                            onChange={(e) => handleMarchSizeChange(index, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button onClick={calculateSquads}>Calculate Squads</button>
            </div>

            <div className="results-section">
            <h3>Adjusted Ratios</h3>
                <p>
                    Infantry: {adjustedRatios.infantry?.toFixed(4) || 0},&nbsp;
                    Lancer: {adjustedRatios.lancer?.toFixed(4) || 0},&nbsp;
                    Marksman: {adjustedRatios.marksman?.toFixed(4) || 0}
                </p>
            <h3>Squads</h3>
                {squads.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Squad</th>
                                <th>Infantry</th>
                                <th>Lancer</th>
                                <th>Marksman</th>
                            </tr>
                        </thead>
                        <tbody>
                           {squads.map((squad, index) => {
                                let label = `Squad ${index + 1}`;
                                if (isRallyCaller && index === 0) {
                                    label = "Squad 1 (Rally Caller)";
                                }
                                 else if (isRallyCaller) {
                                     label = `Squad ${index}`; //offset index
                                }
                                return(
                                <tr key={index}>
                                    <td>{label}</td>
                                    <td>{squad.infantry}</td>
                                    <td>{squad.lancer}</td>
                                    <td>{squad.marksman}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                )}
                <h3>Troop Totals</h3>
                 <p>Total Required Troops: {totalRequiredTroops}</p>
                {
                    Object.keys(additionalTroopsRequired).map(troop => (
                        <p key={troop}> Additional {troop}: {additionalTroopsRequired[troop]}</p>
                    ))
                }
            </div>
        </div>
    );
};

export default SquadBuilder;