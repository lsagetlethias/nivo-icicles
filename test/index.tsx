import { generateLibTree } from '@nivo/generators';
import { config as springConfig } from '@react-spring/web';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IciclesDirection } from '../src';
import { ResponsiveIcicles } from '../src/ResponsiveIcicles';

interface RawDatum {
    loc: number;
    name: string;
}

const commonProperties = {
    data: generateLibTree() as any,
    id: 'name',
    value: 'loc',
};

const App = () => {
    const [direction, setDirection] = useState<IciclesDirection>('top');
    const [config, setConfig] = useState<keyof typeof springConfig>('default');
    return (
        <>
            <select
                onChange={evt =>
                    setDirection(evt.target.value as IciclesDirection)
                }
            >
                <option value="top">TOP</option>
                <option value="bottom">BOTTOM</option>
                <option value="left">LEFT</option>
                <option value="right">RIGHT</option>
            </select>
            <select
                onChange={evt =>
                    setConfig(evt.target.value as keyof typeof springConfig)
                }
            >
                {Object.keys(springConfig).map(c => (
                    <option value={c} key={`spring-${c}`}>
                        {c}
                    </option>
                ))}
            </select>
            <ResponsiveIcicles<RawDatum>
                {...commonProperties}
                direction={direction}
                enableRectLabels
                rectLabelsSkipPercentage={3}
                motionConfig={config}
            />
            <hr />
            {/* <Icicles<RawDatum>
            {...commonProperties}
            width={2000}
            height={2000}
            direction="right"
        /> */}
            {/* <ResponsiveSunburst<RawDatum> {...commonProperties} /> */}
        </>
    );
};

ReactDOM.render(<App />, document.querySelector('#app'));
