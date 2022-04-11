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
import { RectLabelsProps } from './nivo-rects/rect_labels/props';
import { Rect } from './nivo-rects/types';

export type DatumId = string | number;

export type SunburstLayerId = 'arcs' | 'arcLabels';
export type IciclesLayerId = 'rects' | 'rectLabels';

export interface SunburstCustomLayerProps<RawDatum> {
    arcGenerator: ArcGenerator;
    centerX: number;
    centerY: number;
    nodes: SunburstComputedDatum<RawDatum>[];
    radius: number;
}

export interface IciclesCustomLayerProps<RawDatum> {
    nodes: IciclesComputedDatum<RawDatum>[];
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

export interface SunburstComputedDatum<RawDatum> {
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
    parent?: SunburstComputedDatum<RawDatum>;
    // contain own id plus all ancestor ids
    path: DatumId[];
    percentage: number;
    value: number;
}

export type SunburstCommonProps<RawDatum> = {
    animate: boolean;
    borderColor: InheritedColorConfig<SunburstComputedDatum<RawDatum>>;
    borderWidth: number;
    // used if `inheritColorFromParent` is `true`
    childColor: InheritedColorConfig<SunburstComputedDatum<RawDatum>>;
    colorBy: 'id' | 'depth';
    colors: OrdinalColorScaleConfig<
        Omit<SunburstComputedDatum<RawDatum>, 'color' | 'fill'>
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
    tooltip: (props: SunburstComputedDatum<RawDatum>) => JSX.Element;
    transitionMode: ArcTransitionMode;
    value: PropertyAccessor<RawDatum, number>;
    valueFormat?: ValueFormat<number>;
    width: number;
} & ArcLabelsProps<SunburstComputedDatum<RawDatum>>;

export interface IciclesComputedDatum<RawDatum> {
    color: string;
    // contains the raw node's data
    data: RawDatum;
    depth: number;
    // defined when using patterns or gradients
    fill?: string;
    formattedValue: string;
    height: number;
    id: DatumId;
    parent?: IciclesComputedDatum<RawDatum>;
    // contain own id plus all ancestor ids
    path: DatumId[];
    percentage: number;
    rect: Rect;
    value: number;
}

export type IciclesCommonProps<RawDatum> = {
    animate: boolean;
    borderColor: InheritedColorConfig<IciclesComputedDatum<RawDatum>>;
    borderWidth: number;
    // used if `inheritColorFromParent` is `true`
    childColor: InheritedColorConfig<IciclesComputedDatum<RawDatum>>;
    colorBy: 'id' | 'depth';
    colors: OrdinalColorScaleConfig<
        Omit<IciclesComputedDatum<RawDatum>, 'color' | 'fill'>
    >;
    data: RawDatum;
    enableRectLabels: boolean;
    height: number;
    id: PropertyAccessor<RawDatum, DatumId>;
    inheritColorFromParent: boolean;
    isInteractive: boolean;
    layers: IciclesLayer<RawDatum>[];
    margin?: Box;
    motionConfig: ModernMotionProps['motionConfig'];
    rectLabelsTextColor: InheritedColorConfig<RawDatum>;
    renderWrapper: boolean;
    role: string;
    theme: Theme;
    tooltip: (props: IciclesComputedDatum<RawDatum>) => JSX.Element;
    value: PropertyAccessor<RawDatum, number>;
    valueFormat?: ValueFormat<number>;
    width: number;
} & RectLabelsProps<IciclesComputedDatum<RawDatum>>;

export type IciclesMouseHandler<RawDatum> = (
    datum: IciclesComputedDatum<RawDatum>,
    event: React.MouseEvent,
) => void;

export type MouseHandler<RawDatum> = (
    datum: SunburstComputedDatum<RawDatum>,
    event: React.MouseEvent,
) => void;

export type MouseHandlers<RawDatum> = Partial<{
    onClick: MouseHandler<RawDatum>;
    onMouseEnter: MouseHandler<RawDatum>;
    onMouseLeave: MouseHandler<RawDatum>;
    onMouseMove: MouseHandler<RawDatum>;
}>;

export type IciclesMouseHandlers<RawDatum> = Partial<{
    onClick: IciclesMouseHandler<RawDatum>;
    onMouseEnter: IciclesMouseHandler<RawDatum>;
    onMouseLeave: IciclesMouseHandler<RawDatum>;
    onMouseMove: IciclesMouseHandler<RawDatum>;
}>;

export type SunburstSvgProps<RawDatum> = SunburstCommonProps<RawDatum> &
    SvgDefsAndFill<RawDatum> &
    MouseHandlers<RawDatum>;
export type IciclesSvgProps<RawDatum> = IciclesCommonProps<RawDatum> &
    SvgDefsAndFill<RawDatum> &
    IciclesMouseHandlers<RawDatum>;
