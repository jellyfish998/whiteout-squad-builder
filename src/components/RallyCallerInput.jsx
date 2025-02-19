import React from 'react';

const RallyCallerInput = ({ isRallyCaller, onRallyCallerChange }) => {
    return (
        <div className='input-group checkbox-label'>
                <input
                    type="checkbox"
                    checked={isRallyCaller}
                    onChange={onRallyCallerChange}
                    id="rallyCaller"
                />
            <label htmlFor='rallyCaller'>
                Rally Caller
            </label>
        </div>
    );
};

export default RallyCallerInput;