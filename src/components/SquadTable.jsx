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
                                <td>{squad.infantry}</td>
                                <td>{squad.lancer}</td>
                                <td>{squad.marksman}</td>
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