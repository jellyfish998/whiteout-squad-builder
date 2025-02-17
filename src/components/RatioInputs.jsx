// src/components/RatioInputs.jsx
import React from 'react';

const RatioInputs = ({ desiredRatio, onRatioChange }) => {
    return (
        <div>
            <h3>Desired Ratios</h3>
            <table>
                <thead>
                    <tr>
                        <th>Troop Type</th>
                        <th>Desired Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(desiredRatio).map((type) => (
                        <tr key={type}>
                            <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                            <td>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={desiredRatio[type]}
                                    onChange={(e) => onRatioChange(type, e.target.value)}
                                    min="0"
                                    max="1"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RatioInputs;