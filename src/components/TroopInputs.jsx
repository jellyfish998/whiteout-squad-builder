import React from 'react';

const TroopInputs = ({ totalTroops, onTroopChange }) => {
    const handleAddTroopLevel = (type) => {
        onTroopChange(type, [...totalTroops[type], { level: 1, count: 0, sequence: 1 }]);
    };

    const handleRemoveTroopLevel = (type, index) => {
        const newTroops = [...totalTroops[type]];
        newTroops.splice(index, 1);
        onTroopChange(type, newTroops);
    };

    const handleTroopCountChange = (type, index, value) => {
        const newTroops = [...totalTroops[type]];
        newTroops[index] = { ...newTroops[index], count: parseInt(value) || 0 };
        onTroopChange(type, newTroops);
    };
    const handleTroopLevelChange = (type, index, value) => {
        const newTroops = [...totalTroops[type]];
        newTroops[index] = { ...newTroops[index], level: parseInt(value) || 1 };
        onTroopChange(type, newTroops);
    };

    const handleTroopSequenceChange = (type, index, value) => {
        const newTroops = [...totalTroops[type]];
        newTroops[index] = { ...newTroops[index], sequence: parseInt(value) || 1};
        onTroopChange(type, newTroops);
    };
    return (
        <div className="input-group">
            <h3>Troop Inputs</h3>
            <table className="troop-inputs-table">
                <thead>
                    <tr>
                        <th>Troop Type</th>
                        <th>Level</th>
                        <th>Count</th>
                        <th>Sequence</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(totalTroops).map((type) => (
                        totalTroops[type].map((troopLevel, index) => (
                            <tr key={`<span class="math-inline">\{type\}\-</span>{index}`}>
                                <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                                 <td>
                                    <input
                                        type="number"
                                        value={troopLevel.level}
                                        onChange={(e) => handleTroopLevelChange(type, index, e.target.value)}min="1"
                                        className="level-input"
                                    />
                                 </td>
                                <td>
                                    <input
                                        type="number"
                                        value={troopLevel.count}
                                        onChange={(e) => handleTroopCountChange(type, index, e.target.value)}
                                        className="count-input"
                                    />
                                </td>
                                  <td>
                                    <input
                                        type="number"
                                         value={troopLevel.sequence}
                                        onChange={(e) => handleTroopSequenceChange(type, index, e.target.value)}
                                        className="sequence-input"
                                        min="1"
                                     />
                                 </td>
                                <td>
                                    <button className="remove-button" onClick={() => handleRemoveTroopLevel(type, index)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ))}
                    {Object.keys(totalTroops).map((type) => (
                        <tr key={`add-${type}`}>
                           <td colSpan="5">
                                <button className="add-button" onClick={() => handleAddTroopLevel(type)}>
                                    Add {type.charAt(0).toUpperCase() + type.slice(1)} Level
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TroopInputs;