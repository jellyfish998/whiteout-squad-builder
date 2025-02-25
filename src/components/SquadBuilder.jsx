import React, { useState } from 'react';
import TroopInputs from './TroopInputs';
import MarchSizeInputs from './MarchSizeInputs';
import RatioSliders from './RatioSliders';
import RallyCallerInput from './RallyCallerInput';
import AdjustedRatioDisplay from './AdjustedRatioDisplay';
import SquadTable from './SquadTable';
import DebugOutput from './DebugOutput';

const SquadBuilder = () => {
    const [totalTroops, setTotalTroops] = useState({
        infantry: [{ level: 1, count: 338682, sequence: 3 }],
        lancer: [{ level: 1, count: 374057, sequence: 2 }],
        marksman: [{ level: 1, count: 447556, sequence: 1 }],
    });

    const [desiredRatio, setDesiredRatio] = useState({ infantry: 0.1, lancer: 0.1, marksman: 0.8 });
    const [numSquads, setNumSquads] = useState(6);
    const [isRallyCaller, setIsRallyCaller] = useState(true);
    const [adjustedRatios, setAdjustedRatios] = useState({});
    const [squads, setSquads] = useState([]);
    const [debugData, setDebugData] = useState({});
    const [error, setError] = useState('');

    const initialMarchSizes = Array(numSquads + (isRallyCaller ? 1 : 0)).fill(135410);
    const [marchSizes, setMarchSizes] = useState(initialMarchSizes);

    const handleMarchSizeChange = (index, value) => {
        setMarchSizes(prevSizes => {
            if (!Array.isArray(prevSizes)) return prevSizes;  // Prevents crashes if state becomes non-array

            const newMarchSizes = [...prevSizes];
            newMarchSizes[index] = parseInt(value) || 0;  // Ensure valid number
            return newMarchSizes;
        });
    };

    const calculateAdjustedRatios = (remainingTroops, desiredRatio) => {
        let availableTroopsByType = {};
        let totalAvailableTroops = 0;

        for (const type in remainingTroops) {
            availableTroopsByType[type] = remainingTroops[type].reduce((sum, troop) => sum + troop.count, 0);
            totalAvailableTroops += availableTroopsByType[type];
        }

        if (totalAvailableTroops === 0) {
            setError('No remaining troops available for allocation.');
            return {};
        }

        let minScalingFactor = Infinity;
        for (const type in desiredRatio) {
            if (desiredRatio[type] > 0 && availableTroopsByType[type] > 0) {
                minScalingFactor = Math.min(minScalingFactor, availableTroopsByType[type] / desiredRatio[type]);
            }
        }

        let adjustedRatios = {};
        let totalScaledRatio = 0;
        for (const type in desiredRatio) {
            adjustedRatios[type] = (desiredRatio[type] * minScalingFactor);
            totalScaledRatio += adjustedRatios[type];
        }

        for (const type in adjustedRatios) {
            adjustedRatios[type] = adjustedRatios[type] / totalScaledRatio;
        }

        return adjustedRatios;
    };

    const calculateSquads = () => {
        setError('');
        let remainingTroops = JSON.parse(JSON.stringify(totalTroops));

        let rallyCallerSquad = {};
        if (isRallyCaller) {
            rallyCallerSquad = {};
            for (const type in desiredRatio) {
                rallyCallerSquad[type] = [];
                let troopsToAllocate = Math.floor(marchSizes[0] * desiredRatio[type]);

                remainingTroops[type].sort((a, b) => b.sequence - a.sequence || b.level - a.level);
                for (const troop of remainingTroops[type]) {
                    if (troop.count <= 0) continue;
                    const used = Math.min(troopsToAllocate, troop.count);
                    if (used > 0) {
                        rallyCallerSquad[type].push({ level: troop.level, count: used });
                    }
                    troopsToAllocate -= used;
                    troop.count -= used;
                    if (troopsToAllocate <= 0) break;
                }
            }
        }

        const adjustedRatios = calculateAdjustedRatios(remainingTroops, desiredRatio);
        setAdjustedRatios(adjustedRatios);

        const newSquads = marchSizes.slice(isRallyCaller ? 1 : 0).map((size) => {
            const squad = {};
            for (const type in adjustedRatios) {
                squad[type] = [];
                let troopsToAllocate = Math.floor(size * adjustedRatios[type]);

                remainingTroops[type].sort((a, b) => b.sequence - a.sequence || b.level - a.level);
                for (const troop of remainingTroops[type]) {
                    if (troop.count <= 0) continue;

                    const used = Math.min(troopsToAllocate, troop.count);
                    if (used > 0) {
                        squad[type].push({ level: troop.level, count: used });
                    }
                    troopsToAllocate -= used;
                    troop.count -= used;
                    if (troopsToAllocate <= 0) break;
                }
            }
            return squad;
        });

        setSquads(isRallyCaller ? [rallyCallerSquad, ...newSquads] : newSquads);
        setDebugData({
            rallyCallerSquad,
            adjustedRatios,
            squads: newSquads
        });
    };

    return (
        <div className="squad-builder">
            <h2>Whiteout Survival Squad Builder</h2>
            {error && <div className="error">{error}</div>}

            <RatioSliders desiredRatio={desiredRatio} onRatioChange={setDesiredRatio} />
            <AdjustedRatioDisplay adjustedRatios={adjustedRatios} desiredRatio={desiredRatio} />
            <RallyCallerInput isRallyCaller={isRallyCaller} onRallyCallerChange={setIsRallyCaller} />
            <MarchSizeInputs 
                numSquads={numSquads} 
                marchSizes={marchSizes} 
                onNumSquadsChange={setNumSquads} 
                onMarchSizeChange={handleMarchSizeChange} 
            />
            <TroopInputs totalTroops={totalTroops} onTroopChange={setTotalTroops} />
            <button onClick={calculateSquads}>Calculate Squads</button>
            <DebugOutput debugData={debugData} />
            <SquadTable squads={squads} />
        </div>
    );
};

export default SquadBuilder;
