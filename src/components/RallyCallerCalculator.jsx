import React from 'react';

const RallyCallerCalculator = ({ marchSize, desiredRatio, totalTroops }) => {

    const calculateRallyCallerSquad = () => {
        if (!marchSize) {
            return {infantry: [], lancer: [], marksman: [], error: null};
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
                if(troopsToUse > 0){
                  rallyCallerSquad[type].push({level: levelData.level, count: troopsToUse});
                }
                troopsToAllocate -= troopsToUse;
                levelData.count -= troopsToUse;
                 if (troopsToAllocate <= 0) break; // Optimization, exit loop early
             }
              if(troopsToAllocate > 0) {
                return {infantry: [], lancer: [], marksman: [], error: `Not enough ${type} for rally caller`};
              }
         }
        return { ...rallyCallerSquad, error: null };
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
                                <th>Troop Type</th>
                                <th>Level</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                    {Object.keys(totalTroops).map((type) => (
                        infantry ? (
                            rallyCallerSquad[type].map((troopLevel, index) => (
                                <tr key={`${type}-${index}`}>
                                   <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                                   <td>{troopLevel.level}</td>
                                    <td>{troopLevel.count}</td>
                               </tr>
                            ))
                        ) : null
                    ))}
                        </tbody>
                    </table>
                </>

            )}
        </div>
    );
};

export default RallyCallerCalculator;