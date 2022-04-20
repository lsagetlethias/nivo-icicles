import { generateLibTree } from '@nivo/generators';
import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(
    <>
        <ResponsiveIcicles<RawDatum> {...commonProperties} direction="top" />
        <hr />
        {/* <Icicles<RawDatum>
            {...commonProperties}
            width={2000}
            height={2000}
            direction="right"
        /> */}
        {/* <ResponsiveSunburst<RawDatum> {...commonProperties} /> */}
    </>,
    document.querySelector('#app'),
);
