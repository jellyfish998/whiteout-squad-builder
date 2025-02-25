import React from 'react';

const RallyCallerCalculator = ({ marchSize, desiredRatio, totalTroops, onRallyCallerAllocation }) => {
    const allocateRallyCaller = () => {
        let rallyCallerSquad = {};
        let remainingTroops = JSON.parse(JSON.stringify(totalTroops));

        for (const type in desiredRatio) {
            rallyCallerSquad[type] = [];
            let troopsToAllocate = Math.floor(marchSize * desiredRatio[type]);

            remainingTroops[type].sort((a, b) => b.sequence - a.sequence || b.level - a.level);
            for (const troop of remainingTroops[type]) {
                if (troop.count <= 0) continue;
                const used = Math.min(troopsToAllocate, troop.count);
                if (used > 0) {
                    rallyCallerSquad[type].push({ level: troop.level, count: used });
                }
                troopsToAllocate -= used;
                troop.count -= used;
                if (troopsToAllocate <= 0) break;
            }
        }

        onRallyCallerAllocation(rallyCallerSquad, remainingTroops);
        return rallyCallerSquad;
    };

    const rallyCallerSquad = allocateRallyCaller();

    return (
        <div>
            <h3>Rally Caller Squad</h3>
            {Object.keys(rallyCallerSquad).map(type =>
                rallyCallerSquad[type].map((troop, index) => (
                    <p key={`${type}-${index}`}>
                        {type} - Level {troop.level}: {troop.count}
                    </p>
                ))
            )}
        </div>
    );
};

export default RallyCallerCalculator;
