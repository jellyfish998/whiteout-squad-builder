import React from 'react';

const RallyCallerCalculator = ({ marchSize, desiredRatio, totalTroops }) => {

    const calculateRallyCallerSquad = () => {
        if (!marchSize) {
            return {infantry: 0, lancer: 0, marksman: 0, error: null};
        }

        const rallyCallerSquad = {};
        const remainingTroops = JSON.parse(JSON.stringify(totalTroops)); // Deep copy

        for (const type in remainingTroops) {
             rallyCallerSquad[type] = []; //init
            let troopsToAllocate = Math.floor(marchSize * desiredRatio[type]);
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
                if(troopsToUse > 0) {
                    rallyCallerSquad[type].push({level: levelData.level, count: troopsToUse})
                }
                troopsToAllocate -= troopsToUse;
                levelData.count -= troopsToUse;
                 if (troopsToAllocate <= 0) break; // Optimization, exit loop early
             }
              if(troopsToAllocate > 0) {
                return {infantry: [], lancer: [], marksman: [], error: `Not enough ${type} for rally caller`};
              }
         }
         let returnSquad = {}
         for(let troop in rallyCallerSquad){
            returnSquad[troop] = 0;
            if(Array.isArray(rallyCallerSquad[troop])){
                for(let level of rallyCallerSquad[troop]){
                    returnSquad[troop] += level.count;
                }
            } else {
                returnSquad[troop] = rallyCallerSquad[troop];
            }
         }
        return { ...returnSquad, error: null };
    };


    const { infantry, lancer, marksman, error } = calculateRallyCallerSquad();


    return (
        <div>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                  <h3>Rally Caller Squad</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Infantry</th>
                      <th>Lancer</th>
                      <th>Marksman</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td>{infantry}</td>
                        <td>{lancer}</td>
                        <td>{marksman}</td>
                    </tr>
                  </tbody>
                </table>
                </>

            )}
        </div>
    );
};

export default RallyCallerCalculator;