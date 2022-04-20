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
import { Rects } from './Rects';
import { useIcicles, useIciclesLayerContext } from './hooks';
import { RectLabelsLayer } from './nivo-rects/rect_labels/RectLabelsLayer';
import { defaultIciclesProps } from './props';
import { IciclesSvgProps, IciclesLayerId, IciclesComputedDatum } from './types';

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
    id = defaultIciclesProps.id,
    value = defaultIciclesProps.value,
    valueFormat,
    layers = ['rects', 'rectLabels'],
    colors = defaultIciclesProps.colors,
    colorBy = defaultIciclesProps.colorBy,
    inheritColorFromParent = defaultIciclesProps.inheritColorFromParent,
    childColor = defaultIciclesProps.childColor as InheritedColorConfig<
        IciclesComputedDatum<RawDatum>
    >,
    borderWidth = defaultIciclesProps.borderWidth,
    borderColor = defaultIciclesProps.borderColor,
    margin: partialMargin,
    width,
    height,
    enableRectLabels = defaultIciclesProps.enableRectLabels,
    rectLabelsTextColor = defaultIciclesProps.rectLabelsTextColor,
    defs = defaultIciclesProps.defs,
    fill = defaultIciclesProps.fill,
    isInteractive = defaultIciclesProps.isInteractive,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    tooltip = defaultIciclesProps.tooltip,
    role = defaultIciclesProps.role,
    rectLabel = defaultIciclesProps.rectLabel,
    rectLabelsComponent,
    direction = defaultIciclesProps.direction,
}: InnerIciclesProps<RawDatum>) => {
    const { margin, outerHeight, outerWidth } = useDimensions(
        width,
        height,
        partialMargin,
    );

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
        direction,
    });

    const boundDefs = bindDefs(defs, nodes, fill, {
        dataKey: '.',
        colorKey: 'color',
        targetKey: 'fill',
    });

    const layerById: Record<IciclesLayerId, ReactNode> = {
        rects: null,
        rectLabels: null,
    };

    if (layers.includes('rects')) {
        layerById.rects = (
            <Rects<RawDatum>
                key="rects"
                data={nodes}
                borderWidth={borderWidth}
                borderColor={borderColor}
                isInteractive={isInteractive}
                tooltip={tooltip}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
            />
        );
    }

    if (enableRectLabels && layers.includes('rectLabels')) {
        layerById.rectLabels = (
            <RectLabelsLayer<IciclesComputedDatum<RawDatum>>
                key="rectLabels"
                data={nodes}
                label={rectLabel}
                textColor={rectLabelsTextColor}
                component={rectLabelsComponent}
            />
        );
    }

    const layerContext = useIciclesLayerContext<RawDatum>({
        nodes,
    });

    return (
        <SvgWrapper
            width={outerWidth}
            height={outerHeight}
            defs={boundDefs}
            margin={margin}
            role={role}
        >
            {layers?.map((layer, i) => {
                if (layerById[layer as IciclesLayerId] !== undefined) {
                    return layerById[layer as IciclesLayerId];
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

export const Icicles = <RawDatum,>({
    isInteractive = defaultIciclesProps.isInteractive,
    animate = defaultIciclesProps.animate,
    motionConfig = defaultIciclesProps.motionConfig,
    theme,
    renderWrapper,
    ...otherProps
}: Partial<Omit<IciclesSvgProps<RawDatum>, 'data' | 'width' | 'height'>> &
    Pick<IciclesSvgProps<RawDatum>, 'data' | 'width' | 'height'>) => (
    <Container
        {...{ isInteractive, animate, motionConfig, theme, renderWrapper }}
    >
        <InnerIcicles<RawDatum> isInteractive={isInteractive} {...otherProps} />
    </Container>
);
