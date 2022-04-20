import { ArcTransitionMode } from '@nivo/arcs';
import { OrdinalColorScaleConfig } from '@nivo/colors';
import { IciclesTooltip } from './IciclesTooltip';
import { SunburstTooltip } from './SunburstTooltip';
import { IciclesDirection, IciclesLayerId, SunburstLayerId } from './types';

export const defaultProps = {
    id: 'id',
    value: 'value',
    cornerRadius: 0,
    layers: ['arcs', 'arcLabels'] as SunburstLayerId[],
    colors: { scheme: 'nivo' } as unknown as OrdinalColorScaleConfig,
    colorBy: 'id' as const,
    inheritColorFromParent: true,
    childColor: { from: 'color' },
    borderWidth: 1,
    borderColor: 'white',
    enableArcLabels: false,
    arcLabel: 'formattedValue',
    arcLabelsRadiusOffset: 0.5,
    arcLabelsSkipAngle: 0,
    arcLabelsTextColor: { theme: 'labels.text.fill' },
    animate: true,
    motionConfig: 'gentle',
    transitionMode: 'innerRadius' as ArcTransitionMode,
    isInteractive: true,
    defs: [],
    fill: [],
    tooltip: SunburstTooltip,
    role: 'img',
};

export const defaultIciclesProps = {
    id: 'id',
    value: 'value',
    layers: ['rect', 'rectLabels'] as IciclesLayerId[],
    colors: { scheme: 'nivo' } as unknown as OrdinalColorScaleConfig,
    colorBy: 'id' as const,
    inheritColorFromParent: true,
    childColor: { from: 'color' },
    borderWidth: 1,
    borderColor: 'white',
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
};
