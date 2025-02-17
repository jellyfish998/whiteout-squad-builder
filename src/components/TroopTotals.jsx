import React from 'react';
const TroopTotals = ({ totalRequiredTroops, additionalTroopsRequired }) => {
    return (
        <>
        <h3>Troop Totals</h3>
        <p>Total Required Troops: {totalRequiredTroops}</p>
        {
            Object.keys(additionalTroopsRequired).map(troop => (
                <p key={troop}> Additional {troop}: {additionalTroopsRequired[troop]}</p>
            ))
        }
        </>
    );
};

export default TroopTotals;