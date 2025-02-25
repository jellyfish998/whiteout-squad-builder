import React from 'react';

const SquadDistributor = ({ marchSizes, adjustedRatios, remainingTroops, onSquadsAllocated }) => {
    const distributeTroops = () => {
        let squads = [];

        marchSizes.forEach((size, index) => {
            let squad = {};

            for (const type in adjustedRatios) {
                squad[type] = [];
                let troopsToAllocate = Math.floor(size * adjustedRatios[type]);

                remainingTroops[type].sort((a, b) => b.sequence - a.sequence || b.level - a.level);
                for (const troop of remainingTroops[type]) {
                    if (troop.count <= 0) continue;

                    const used = Math.min(troopsToAllocate, troop.count);
                    if (used > 0) {
                        squad[type].push({ level: troop.level, count: used });
                    }
                    troopsToAllocate -= used;
                    troop.count -= used;
                    if (troopsToAllocate <= 0) break;
                }
            }

            squads.push(squad);
        });

        onSquadsAllocated(squads);
        return squads;
    };

    const squads = distributeTroops();

    return (
        <div>
            <h3>Squad Troop Distribution</h3>
            {squads.map((squad, index) => (
                <div key={index}>
                    <h4>Squad {index + 1}</h4>
                    {Object.keys(squad).map(type =>
                        squad[type].map((troop, i) => (
                            <p key={`${type}-${i}`}>
                                {type} - Level {troop.level}: {troop.count}
                            </p>
                        ))
                    )}
                </div>
            ))}
        </div>
    );
};

export default SquadDistributor;
