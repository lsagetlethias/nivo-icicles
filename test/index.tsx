import { generateLibTree } from '@nivo/generators';
import React from 'react';
import ReactDOM from 'react-dom';
import { Sunburst } from '../src';
import { Icicles } from '../src/Icicles';

interface RawDatum {
    loc: number;
    name: string;
}

const commonProperties = {
    width: 900,
    height: 500,
    data: generateLibTree() as any,
    id: 'name',
    value: 'loc',
};

ReactDOM.render(
    <>
        <Icicles<RawDatum> {...commonProperties} />
        <Sunburst<RawDatum> {...commonProperties} />
    </>,
    document.querySelector('#app'),
);
