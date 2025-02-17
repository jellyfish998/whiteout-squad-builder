import React from 'react';

const TroopTotals = ({ totalRequiredTroops, additionalTroopsRequired }) => {
  return (
    <>
      <h3>Troop Totals</h3>
      <p>Total Required Troops: {totalRequiredTroops}</p>
      {Object.entries(additionalTroopsRequired).map(([type, levels]) => {
          if(Array.isArray(levels)){
            return levels.length > 0 && (
                <div key={type}>
                  Additional {type}:
                </div>
            )
          } else {
            return (
                <div key={type}>
                  Additional {type}: {levels}
                </div>
            )
          }

      })}
    </>
  )
};

export default TroopTotals;