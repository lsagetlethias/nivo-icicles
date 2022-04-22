import { OrdinalColorScaleConfig } from '@nivo/colors';
import { IciclesTooltip } from './IciclesTooltip';
import { IciclesDirection, IciclesLayerId } from './types';

export const defaultIciclesProps = {
    id: 'id',
    value: 'value',
    layers: ['rect', 'rectLabels'] as IciclesLayerId[],
    colors: { scheme: 'nivo' } as unknown as OrdinalColorScaleConfig,
    colorBy: 'id' as const,
    inheritColorFromParent: true,
    childColor: { from: 'color' },
    borderWidth: 1,
    borderColor: { from: 'color' },
    enableRectLabels: false,
    rectLabel: 'formattedValue',
    rectLabelsTextColor: { theme: 'labels.text.fill' },
    animate: true,
    motionConfig: 'gentle',
    isInteractive: true,
    defs: [],
    fill: [],
    tooltip: IciclesTooltip,
    role: 'img',
    direction: 'bottom' as IciclesDirection,
    rectLabelsSkipLength: 0,
    rectLabelsSkipPercentage: 0,
    rectLabelsOffset: 1,
};
