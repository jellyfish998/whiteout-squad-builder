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
    const [marchSize, setMarchSize] = useState(135410);
    const [rallyCaller, setRallyCaller] = useState({});
    const [remainingTroops, setRemainingTroops] = useState({});
    const [totalRequiredTroops, setTotalRequiredTroops] = useState(0);
    const [requiredTroopsByType, setRequiredTroopsByType] = useState({});
    const [additionalTroopsRequired, setAdditionalTroopsRequired] = useState({});
    const [adjustedRatio, setAdjustedRatio] = useState({});
    const [squads, setSquads] = useState([]);


    const handleTroopChange = (type, value) => {
        setTotalTroops({ ...totalTroops, [type]: parseInt(value) || 0 });
    };

    const handleRatioChange = (type, value) => {
        setDesiredRatio({ ...desiredRatio, [type]: parseFloat(value) || 0 });
    };

    const handleSequenceChange = (type, value) => {
        setSequence({ ...sequence, [type]: parseInt(value) || 0 });
    };
     const handleMarchSizeChange = (value) => {
        setMarchSize(parseInt(value) || 0);
    };

    const calculateSquads = () => {
        // 4. Rally Caller Squad
        const rallyCallerSquad = {
            infantry: Math.floor(marchSize * desiredRatio.infantry),
            lancer: Math.floor(marchSize * desiredRatio.lancer),
            marksman: Math.floor(marchSize * desiredRatio.marksman),
        };
        setRallyCaller(rallyCallerSquad);
       // 5. Remaining Troops
        const remaining = {
            infantry: totalTroops.infantry - rallyCallerSquad.infantry,
            lancer: totalTroops.lancer - rallyCallerSquad.lancer,
            marksman: totalTroops.marksman - rallyCallerSquad.marksman,
        };
        setRemainingTroops(remaining);

        // 6. Total Required Troops (for 5 more full marches + 1 partial)
        const numFullMarches = 5; // Squads 1-5
        //Find any partial march based on having a remainder.
        const hasPartialMarch =  (remaining.infantry + remaining.lancer + remaining.marksman) > 0
        const totalMarches = numFullMarches + (hasPartialMarch ? 1 : 0)

        const totalRequired = marchSize * totalMarches;
        setTotalRequiredTroops(totalRequired);


        // 7. Required Troops by Type & Additional Troops Required
         const requiredByType = {};
        const additionalRequired = {};
        let totalRemainingTroops = remaining.infantry + remaining.lancer + remaining.marksman;
         for (const type in totalTroops) {
            requiredByType[type] = totalRequired * desiredRatio[type];
            additionalRequired[type] = Math.max(0, requiredByType[type] - totalRemainingTroops); // Prevent negative
            if(additionalRequired[type] < 0) additionalRequired[type] = 0;
         }

        setRequiredTroopsByType(requiredByType);
        setAdditionalTroopsRequired(additionalRequired);



        // 8. Adjusted Ratio
        const sortedSequence = Object.entries(sequence).sort(([, a], [, b]) => a - b);
        let remainingMarchCapacity = totalRequired;
        const adjRatio = { ...desiredRatio };

        for (const [troopType] of sortedSequence) {
            let allocated = Math.min(remainingTroops[troopType], remainingMarchCapacity); //Key change
             adjRatio[troopType] = allocated/totalRequired;

             remainingMarchCapacity -= allocated;

        }

        setAdjustedRatio(adjRatio);

        // 9. Build Squads
        const builtSquads = [];
        for (let i = 0; i < 6; i++) {
            let currentMarchSize = (i < numFullMarches) ? marchSize : (remaining.infantry + remaining.lancer + remaining.marksman);
            if (i === 5 && !hasPartialMarch) {
                currentMarchSize = 0; // No partial march
            }

            const squad = {
                infantry: Math.floor(currentMarchSize * adjRatio.infantry),
                lancer: Math.floor(currentMarchSize * adjRatio.lancer),
                marksman: Math.floor(currentMarchSize * adjRatio.marksman),
            };
            builtSquads.push(squad);
        }

        setSquads(builtSquads);
    };


   return (
       <div className="squad-builder">
           <h2>Whiteout Survival Squad Builder</h2>
           <div className="input-section">
               <h3>Inputs</h3>
               <div>
                    <label>March Size:</label>
                   <input
                       type="number"
                       value={marchSize}
                       onChange={(e) => handleMarchSizeChange(e.target.value)}
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
                                   />
                               </td>
                               <td>
                                   <input
                                       type="number"
                                       value={sequence[type]}
                                       onChange={(e) => handleSequenceChange(type, e.target.value)}
                                   />
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
               <button onClick={calculateSquads}>Calculate Squads</button>
           </div>

           <div className="results-section">
                <h3>Rally Caller</h3>
                <p>Infantry: {rallyCaller.infantry}, Lancer: {rallyCaller.lancer}, Marksman: {rallyCaller.marksman}</p>

                <h3>Remaining Troops</h3>
                <p>Infantry: {remainingTroops.infantry}, Lancer: {remainingTroops.lancer}, Marksman: {remainingTroops.marksman}</p>

                <h3>Total Required Troops</h3>
                <p>{totalRequiredTroops}</p>

                <h3>Required Troops by Type</h3>
                <p>Infantry: {requiredTroopsByType.infantry}, Lancer: {requiredTroopsByType.lancer}, Marksman:{requiredTroopsByType.marksman}</p>

                <h3>Additional Troops Required</h3>
                <p>Infantry: {additionalTroopsRequired.infantry}, Lancer: {additionalTroopsRequired.lancer}, Marksman: {additionalTroopsRequired.marksman}</p>
                <h3>Adjusted Ratios</h3>
                <p>Infantry: {adjustedRatio.infantry?.toFixed(2) || 0}, Lancer: {adjustedRatio.lancer?.toFixed(2) || 0}, Marksman: {adjustedRatio.marksman?.toFixed(2) || 0}</p>

               <h3>Squads</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Squad</th>
                            <th>March Size</th>
                            <th>Infantry</th>
                            <th>Lancer</th>
                            <th>Marksman</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squads.map((squad, index) => (
                            <tr key={index}>
                                <td>Squad {index + 1}</td>
                                <td>{(index < 5) ? marchSize: (remainingTroops.infantry + remainingTroops.lancer + remainingTroops.marksman)}</td>
                                <td>{squad.infantry}</td>
                                <td>{squad.lancer}</td>
                                <td>{squad.marksman}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
       </div>
   );
};

export default SquadBuilder;