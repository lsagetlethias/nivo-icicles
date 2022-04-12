import { generateLibTree } from '@nivo/generators';
import React from 'react';
import ReactDOM from 'react-dom';
import { ResponsiveSunburst } from '../src';
import { Icicles } from '../src/Icicles';
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
        <ResponsiveIcicles<RawDatum> {...commonProperties} />
        <hr />
        <Icicles<RawDatum> {...commonProperties} width={2000} height={2000} />
        <ResponsiveSunburst<RawDatum> {...commonProperties} />
    </>,
    document.querySelector('#app'),
);
