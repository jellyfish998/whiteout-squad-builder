import React from 'react';

const DebugOutput = ({ debugData }) => {
    const exportDebugJson = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(debugData, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "squad_builder_debug.json";
        link.click();
    };

    return (
        <div>
            <button onClick={exportDebugJson}>Download Debug JSON</button>
        </div>
    );
};

export default DebugOutput;
