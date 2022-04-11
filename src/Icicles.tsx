import { ArcLabelsLayer } from '@nivo/arcs';
import { InheritedColorConfig } from '@nivo/colors';
import {
    // @ts-ignore
    bindDefs,
    Container,
    SvgWrapper,
    useDimensions,
} from '@nivo/core';
import { Fragment, ReactNode, createElement } from 'react';
import React from 'react';
import { Arcs } from './Arcs';
import { useIcicles, useSunburstLayerContext } from './hooks';
import { defaultProps } from './props';
import {
    SunburstSvgProps,
    SunburstLayerId,
    ComputedDatum,
    IciclesSvgProps,
    IciclesLayerId,
} from './types';

type InnerSunburstProps<RawDatum> = Partial<
    Omit<
        SunburstSvgProps<RawDatum>,
        | 'data'
        | 'width'
        | 'height'
        | 'isInteractive'
        | 'animate'
        | 'motionConfig'
    >
> &
    Pick<
        SunburstSvgProps<RawDatum>,
        'data' | 'width' | 'height' | 'isInteractive'
    >;
type InnerIciclesProps<RawDatum> = Partial<
    Omit<
        IciclesSvgProps<RawDatum>,
        | 'data'
        | 'width'
        | 'height'
        | 'isInteractive'
        | 'animate'
        | 'motionConfig'
    >
> &
    Pick<
        IciclesSvgProps<RawDatum>,
        'data' | 'width' | 'height' | 'isInteractive'
    >;

const InnerIcicles = <RawDatum,>({
    data,
    id = defaultProps.id,
    value = defaultProps.value,
    valueFormat,
    layers = ['node', 'labels'],
    colors = defaultProps.colors,
    colorBy = defaultProps.colorBy,
    inheritColorFromParent = defaultProps.inheritColorFromParent,
    childColor = defaultProps.childColor as InheritedColorConfig<
        ComputedDatum<RawDatum>
    >,
    borderWidth = defaultProps.borderWidth,
    borderColor = defaultProps.borderColor,
    margin: partialMargin,
    width,
    height,
    enableLabels = defaultProps.enableArcLabels,
    labelsTextColor = defaultProps.arcLabelsTextColor,
    defs = defaultProps.defs,
    fill = defaultProps.fill,
    isInteractive = defaultProps.isInteractive,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    tooltip = defaultProps.tooltip,
    role = defaultProps.role,
}: InnerIciclesProps<RawDatum>) => {
    const { innerHeight, innerWidth, margin, outerHeight, outerWidth } =
        useDimensions(width, height, partialMargin);

    const { nodes } = useIcicles({
        data,
        id,
        value,
        valueFormat,
        colors,
        colorBy,
        inheritColorFromParent,
        childColor,
        height,
        width,
    });

    const boundDefs = bindDefs(defs, nodes, fill, {
        dataKey: '.',
        colorKey: 'color',
        targetKey: 'fill',
    });

    const layerById: Record<IciclesLayerId, ReactNode> = {
        node: null,
        labels: null,
    };

    if (layers.includes('node')) {
        layerById.node = (
            <Arcs<RawDatum>
                key="arcs"
                center={[centerX, centerY]}
                data={nodes}
                arcGenerator={arcGenerator}
                borderWidth={borderWidth}
                borderColor={borderColor}
                transitionMode={transitionMode}
                isInteractive={isInteractive}
                tooltip={tooltip}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
            />
        );
    }

    if (enableLabels && layers.includes('labels')) {
        layerById.arcLabels = (
            <ArcLabelsLayer<ComputedDatum<RawDatum>>
                key="arcLabels"
                center={[centerX, centerY]}
                data={nodes}
                label={arcLabel}
                radiusOffset={arcLabelsRadiusOffset}
                skipAngle={arcLabelsSkipAngle}
                textColor={arcLabelsTextColor}
                transitionMode={transitionMode}
                component={arcLabelsComponent}
            />
        );
    }

    const layerContext = useSunburstLayerContext<RawDatum>({
        nodes,
        arcGenerator,
        centerX,
        centerY,
        radius,
    });

    return (
        <SvgWrapper
            width={outerWidth}
            height={outerHeight}
            defs={boundDefs}
            margin={margin}
            role={role}
        >
            {layers.map((layer, i) => {
                if (layerById[layer as SunburstLayerId] !== undefined) {
                    return layerById[layer as SunburstLayerId];
                }

                if (typeof layer === 'function') {
                    return (
                        <Fragment key={i}>
                            {createElement(layer, layerContext)}
                        </Fragment>
                    );
                }

                return null;
            })}
        </SvgWrapper>
    );
};

export const Sunburst = <RawDatum,>({
    isInteractive = defaultProps.isInteractive,
    animate = defaultProps.animate,
    motionConfig = defaultProps.motionConfig,
    theme,
    renderWrapper,
    ...otherProps
}: Partial<Omit<SunburstSvgProps<RawDatum>, 'data' | 'width' | 'height'>> &
    Pick<SunburstSvgProps<RawDatum>, 'data' | 'width' | 'height'>) => (
    <Container
        {...{ isInteractive, animate, motionConfig, theme, renderWrapper }}
    >
        <InnerIcicles<RawDatum> isInteractive={isInteractive} {...otherProps} />
    </Container>
);
