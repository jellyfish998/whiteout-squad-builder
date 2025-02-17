import React from 'react';

const SquadTable = ({ squads, isRallyCaller }) => {
    return (
        <>
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
                        } else if (isRallyCaller) {
                            label = `Squad ${index}`;
                        }

                        return (
                            <tr key={index}>
                                <td>{label}</td>
                                <td>
                                    {Array.isArray(squad.infantry) ? (
                                        squad.infantry.map((levelData, levelIndex) => (
                                            <div key={`infantry-<span class="math-inline">\{index\}\-</span>{levelIndex}`}>
                                                Level {levelData.level}: {levelData.count}
                                            </div>
                                        ))
                                    ) : (
                                        squad.infantry // Fallback for initial state or errors
                                    )}
                                </td>
                                <td>
                                     {Array.isArray(squad.lancer) ? (
                                        squad.lancer.map((levelData, levelIndex) => (
                                            <div key={`lancer-<span class="math-inline">\{index\}\-</span>{levelIndex}`}>
                                                Level {levelData.level}: {levelData.count}
                                            </div>
                                        ))
                                    ) : (
                                        squad.lancer
                                    )}
                                </td>
                                <td>
                                    {Array.isArray(squad.marksman) ? (
                                        squad.marksman.map((levelData, levelIndex) => (
                                            <div key={`marksman-${index}-${levelIndex}`}>
                                                Level {levelData.level}: {levelData.count}
                                            </div>
                                        ))
                                    ) : (
                                        squad.marksman
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}
        </>
    );
};

export default SquadTable;