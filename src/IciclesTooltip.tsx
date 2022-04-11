import { BasicTooltip } from '@nivo/tooltip';
import React from 'react';
import { IciclesComputedDatum } from './types';

export const IciclesTooltip = <RawDatum,>({
    id,
    formattedValue,
    color,
}: IciclesComputedDatum<RawDatum>) => (
    <BasicTooltip
        id={id}
        value={formattedValue}
        enableChip={true}
        color={color}
    />
);
