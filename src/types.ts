import {
    Arc,
    ArcGenerator,
    ArcLabelsProps,
    ArcTransitionMode,
} from '@nivo/arcs';
import { OrdinalColorScaleConfig, InheritedColorConfig } from '@nivo/colors';
import {
    Theme,
    Box,
    ValueFormat,
    SvgDefsAndFill,
    ModernMotionProps,
    PropertyAccessor,
} from '@nivo/core';

export type DatumId = string | number;

export type SunburstLayerId = 'arcs' | 'arcLabels';
export type IciclesLayerId = 'node' | 'labels';

export interface SunburstCustomLayerProps<RawDatum> {
    arcGenerator: ArcGenerator;
    centerX: number;
    centerY: number;
    nodes: ComputedDatum<RawDatum>[];
    radius: number;
}

export interface IciclesCustomLayerProps<RawDatum> {
    nodes: ComputedDatum<RawDatum>[];
}

export type SunburstCustomLayer<RawDatum> = React.FC<
    SunburstCustomLayerProps<RawDatum>
>;
export type IciclesCustomLayer<RawDatum> = React.FC<
    IciclesCustomLayerProps<RawDatum>
>;

export type SunburstLayer<RawDatum> =
    | SunburstLayerId
    | SunburstCustomLayer<RawDatum>;

export type IciclesLayer<RawDatum> =
    | IciclesLayerId
    | IciclesCustomLayer<RawDatum>;

export interface DataProps<RawDatum> {
    data: RawDatum;
    id?: PropertyAccessor<RawDatum, DatumId>;
    value?: PropertyAccessor<RawDatum, number>;
    valueFormat?: ValueFormat<number>;
}

export interface ChildrenDatum<RawDatum> {
    children?: Array<RawDatum & ChildrenDatum<RawDatum>>;
}

export interface ComputedDatum<RawDatum> {
    arc: Arc;
    color: string;
    // contains the raw node's data
    data: RawDatum;
    depth: number;
    // defined when using patterns or gradients
    fill?: string;
    formattedValue: string;
    height: number;
    id: DatumId;
    parent?: ComputedDatum<RawDatum>;
    // contain own id plus all ancestor ids
    path: DatumId[];
    percentage: number;
    value: number;
}

export type SunburstCommonProps<RawDatum> = {
    animate: boolean;
    borderColor: InheritedColorConfig<ComputedDatum<RawDatum>>;
    borderWidth: number;
    // used if `inheritColorFromParent` is `true`
    childColor: InheritedColorConfig<ComputedDatum<RawDatum>>;
    colorBy: 'id' | 'depth';
    colors: OrdinalColorScaleConfig<
        Omit<ComputedDatum<RawDatum>, 'color' | 'fill'>
    >;
    cornerRadius: number;
    data: RawDatum;
    enableArcLabels: boolean;
    height: number;
    id: PropertyAccessor<RawDatum, DatumId>;
    inheritColorFromParent: boolean;
    isInteractive: boolean;
    layers: SunburstLayer<RawDatum>[];
    margin?: Box;
    motionConfig: ModernMotionProps['motionConfig'];
    renderWrapper: boolean;
    role: string;
    theme: Theme;
    tooltip: (props: ComputedDatum<RawDatum>) => JSX.Element;
    transitionMode: ArcTransitionMode;
    value: PropertyAccessor<RawDatum, number>;
    valueFormat?: ValueFormat<number>;
    width: number;
} & ArcLabelsProps<ComputedDatum<RawDatum>>;

export type IciclesCommonProps<RawDatum> = {
    animate: boolean;
    borderColor: InheritedColorConfig<ComputedDatum<RawDatum>>;
    borderWidth: number;
    // used if `inheritColorFromParent` is `true`
    childColor: InheritedColorConfig<ComputedDatum<RawDatum>>;
    colorBy: 'id' | 'depth';
    colors: OrdinalColorScaleConfig<
        Omit<ComputedDatum<RawDatum>, 'color' | 'fill'>
    >;
    data: RawDatum;
    enableLabels: boolean;
    height: number;
    id: PropertyAccessor<RawDatum, DatumId>;
    inheritColorFromParent: boolean;
    isInteractive: boolean;
    labelsTextColor: InheritedColorConfig<RawDatum>;
    layers: IciclesLayer<RawDatum>[];
    margin?: Box;
    motionConfig: ModernMotionProps['motionConfig'];
    renderWrapper: boolean;
    role: string;
    theme: Theme;
    tooltip: (props: ComputedDatum<RawDatum>) => JSX.Element;
    value: PropertyAccessor<RawDatum, number>;
    valueFormat?: ValueFormat<number>;
    width: number;
};

export type MouseHandler<RawDatum> = (
    datum: ComputedDatum<RawDatum>,
    event: React.MouseEvent,
) => void;

export type MouseHandlers<RawDatum> = Partial<{
    onClick: MouseHandler<RawDatum>;
    onMouseEnter: MouseHandler<RawDatum>;
    onMouseLeave: MouseHandler<RawDatum>;
    onMouseMove: MouseHandler<RawDatum>;
}>;

export type SunburstSvgProps<RawDatum> = SunburstCommonProps<RawDatum> &
    SvgDefsAndFill<RawDatum> &
    MouseHandlers<RawDatum>;
export type IciclesSvgProps<RawDatum> = IciclesCommonProps<RawDatum> &
    SvgDefsAndFill<RawDatum> &
    MouseHandlers<RawDatum>;
