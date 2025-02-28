import React from 'react';

const TroopInputs = ({ totalTroops, onTroopChange }) => {
    const handleCountChange = (type, levelIndex, newCount) => {
        const newTroops = { ...totalTroops };
        newTroops[type] = newTroops[type].map((levelData, index) =>
            index === levelIndex ? { ...levelData, count: Math.max(0, parseInt(newCount) || 0) } : levelData
        );
        onTroopChange(type, newTroops[type]);
    };

    const handleAddLevel = (type) => {
        const newTroops = { ...totalTroops };
        newTroops[type] = [...newTroops[type], { level: newTroops[type].length + 1, count: 0, sequence: 1 }];
        onTroopChange(type, newTroops[type]);
    };
    const handleRemoveLevel = (type, levelIndex) => {
        const newTroops = { ...totalTroops };
        newTroops[type] = newTroops[type].filter((_, index) => index !== levelIndex);
        onTroopChange(type, newTroops[type]);
    };

      const handleSequenceChange = (type, levelIndex, newSequence) => {
        const newTroops = { ...totalTroops };
        newTroops[type] = newTroops[type].map((levelData, index) =>
          index === levelIndex ? { ...levelData, sequence: parseInt(newSequence) || 1 } : levelData
        );
        onTroopChange(type, newTroops[type]);
    };


    return (
        <div className="troop-inputs">
            {Object.entries(totalTroops).map(([type, levels]) => (
                <div key={type} className="troop-type">
                    <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    {levels.map((levelData, index) => (
                        <div key={index} className="troop-level">
                            <label>
                                Level {levelData.level}:
                                <input
                                    type="number"
                                    value={levelData.count}
                                    onChange={(e) => handleCountChange(type, index, e.target.value)}
                                    min="0"
                                />
                            </label>
                            <label>
                                Sequence:
                                <input
                                  type="number"
                                  value={levelData.sequence}
                                  onChange={(e) => handleSequenceChange(type, index, e.target.value)}
                                  min="1"
                                />
                            </label>
                             <button type="button" onClick={() => handleRemoveLevel(type, index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddLevel(type)}>Add Level</button>
                </div>
            ))}
        </div>
    );
};

export default TroopInputs;