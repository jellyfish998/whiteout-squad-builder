import React from 'react';

const RallyCallerCalculator = ({ marchSize, desiredRatio, totalTroops, sequence }) => {

    const calculateRallyCallerSquad = () => {
        if (!marchSize) {
            return {infantry: 0, lancer: 0, marksman: 0, error: null};
        }

        const rallyCallerSquad = {};
        const remainingTroops = JSON.parse(JSON.stringify(totalTroops)); // Deep copy

        for (const type in remainingTroops) {
             rallyCallerSquad[type] = 0; //init
            let troopsToAllocate = Math.floor(marchSize * desiredRatio[type]);
             // Sort troop levels by sequence (higher levels first, based on sequence object)
             const sortedTroopLevels = [...remainingTroops[type]].sort((a, b) => sequence[type] - sequence[type]);

              for (const levelData of sortedTroopLevels) {
                const troopsToUse = Math.min(troopsToAllocate, levelData.count);
                rallyCallerSquad[type] += troopsToUse;
                troopsToAllocate -= troopsToUse;
                levelData.count -= troopsToUse;
                 if (troopsToAllocate <= 0) break; // Optimization, exit loop early
             }
              if(troopsToAllocate > 0) {
                return {infantry: 0, lancer: 0, marksman: 0, error: `Not enough ${type} for rally caller`};
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