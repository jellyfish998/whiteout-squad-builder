import React from 'react';

const MarchSizeInputs = ({ numSquads, marchSizes, isRallyCaller, onNumSquadsChange, onMarchSizeChange }) => {
    const handleSizeChange = (index, value) => {
        onMarchSizeChange(index, value);
    };

  const effectiveNumSquads = isRallyCaller ? numSquads + 1 : numSquads;


    return (
        <div className="march-size-inputs">
            <div>
                <label htmlFor="num-squads">Number of Squads (excluding Rally Caller):</label>
                <input
                    id="num-squads"
                    type="number"
                    value={numSquads}
                    onChange={(e) => onNumSquadsChange(e.target.value)}
                    min="1"
                />
            </div>
            <h3>March Sizes</h3>
            <div className='march-sizes-container'>
                 {Array.from({ length: effectiveNumSquads }).map((_, index) => {
                   const label = isRallyCaller && index === 0 ? "Squad 1 (Rally Caller)" : `Squad ${index + (isRallyCaller? 0:1)}`;
                    return(
                        <div key={index}>
                        <label htmlFor={`march-size-${index}`}>{label}:</label>
                        <input
                            type="number"
                            id={`march-size-${index}`}
                            value={marchSizes[index] !== undefined ? marchSizes[index] : ''}
                            onChange={(e) => handleSizeChange(index, e.target.value)}
                            min="0"
                        />
                        </div>
                    );
                 })}
            </div>
        </div>
    );
};

export default MarchSizeInputs;