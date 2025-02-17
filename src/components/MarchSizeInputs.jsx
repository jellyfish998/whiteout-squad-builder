import React from 'react';

const MarchSizeInputs = ({ numSquads, marchSizes, isRallyCaller, onNumSquadsChange, onMarchSizeChange }) => {
    return (
        <>
            <div>
                <label>Number of Squads:</label>
                <input
                    type="number"
                    value={numSquads}
                    onChange={(e) => onNumSquadsChange(e.target.value)}
                    min="1"
                />
            </div>
            <h3>March Sizes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Squad</th>
                        <th>March Size</th>
                    </tr>
                </thead>
                <tbody>
                    {marchSizes.slice(0, isRallyCaller ? numSquads + 1 : numSquads).map((size, index) => {
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
                                    <input
                                        type="number"
                                        value={size}
                                        onChange={(e) => onMarchSizeChange(index, e.target.value)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default MarchSizeInputs;