import { colorSchemes } from '@nivo/colors';
import { generateLibTree } from '@nivo/generators';
import { config as springConfig } from '@react-spring/web';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IciclesComputedDatum, IciclesDirection } from '../src';
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

const flatten = <T extends { children: T[] }>(data: T[]): T[] =>
    data.reduce<T[]>((acc, item) => {
        if (item.children) {
            return [...acc, item, ...flatten(item.children)];
        }

        return [...acc, item];
    }, []);

const findObject = <T extends { name: string }>(
    data: T[],
    name: string,
): T | undefined => data.find(searchedName => searchedName.name === name);

const drillDownColors = colorSchemes.brown_blueGreen[7];
const drillDownColorMap = {
    viz: drillDownColors[0],
    colors: drillDownColors[1],
    utils: drillDownColors[2],
    generators: drillDownColors[3],
    set: drillDownColors[4],
    text: drillDownColors[5],
    misc: drillDownColors[6],
};
const getDrillDownColor = (
    node: Omit<IciclesComputedDatum<RawDatum>, 'color' | 'fill'>,
) => {
    const category = [
        ...node.path,
    ].reverse()[1] as keyof typeof drillDownColorMap;

    return drillDownColorMap[category];
};

const App = () => {
    const [direction, setDirection] = useState<IciclesDirection>('top');
    const [config, setConfig] = useState<keyof typeof springConfig>('default');
    const [data, setData] = useState(commonProperties.data);
    return (
        <>
            <button onClick={() => setData(commonProperties.data)}>
                Reset
            </button>
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
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.6]],
                }}
                rectLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 3]],
                }}
                data={data}
                onClick={clickedData => {
                    const foundObject = findObject(
                        flatten(data.children) as any,
                        clickedData.id as string,
                    );
                    if (foundObject && (foundObject as any).children) {
                        setData(foundObject);
                    }
                }}
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
