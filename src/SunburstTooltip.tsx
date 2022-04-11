import { BasicTooltip } from '@nivo/tooltip';
import React from 'react';
import { SunburstComputedDatum } from './types';

export const SunburstTooltip = <RawDatum,>({
    id,
    formattedValue,
    color,
}: SunburstComputedDatum<RawDatum>) => (
    <BasicTooltip
        id={id}
        value={formattedValue}
        enableChip={true}
        color={color}
    />
);
