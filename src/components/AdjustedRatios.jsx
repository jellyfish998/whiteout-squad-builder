import React from 'react';

const AdjustedRatios = ({ adjustedRatios }) => {

    return (
        <>
            <h3>Adjusted Ratios</h3>
                <p>
                    Infantry: {adjustedRatios.infantry?.toFixed(4) || 0},&nbsp;
                    Lancer: {adjustedRatios.lancer?.toFixed(4) || 0},&nbsp;
                    Marksman: {adjustedRatios.marksman?.toFixed(4) || 0}
                </p>
        </>
    )
};

export default AdjustedRatios;