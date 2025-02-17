import React from 'react';

const RallyCallerInput = ({ isRallyCaller, onRallyCallerChange }) => {
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={isRallyCaller}
                    onChange={onRallyCallerChange}
                />
                Rally Caller
            </label>
        </div>
    );
};

export default RallyCallerInput;