import { InheritedColorConfig, useInheritedColor } from '@nivo/colors';
import { useTheme } from '@nivo/core';
import React, { createElement } from 'react';
import { RectMouseHandler, RectShape, RectShapeProps } from './RectShape';
import { DatumWithRectAndColor } from './types';
import { useRectsTransition } from './useRectsTransition';

export type RectComponent<TDatum extends DatumWithRectAndColor> = (
    props: RectShapeProps<TDatum>,
) => JSX.Element;

interface RectsLayerProps<TDatum extends DatumWithRectAndColor> {
    borderColor: InheritedColorConfig<TDatum>;
    borderWidth: number;
    component?: RectComponent<TDatum>;
    data: TDatum[];
    onClick?: RectMouseHandler<TDatum>;
    onMouseEnter?: RectMouseHandler<TDatum>;
    onMouseLeave?: RectMouseHandler<TDatum>;
    onMouseMove?: RectMouseHandler<TDatum>;
}

export const RectsLayer = <TDatum extends DatumWithRectAndColor>({
    borderColor,
    onMouseMove,
    onMouseLeave,
    onMouseEnter,
    onClick,
    borderWidth,
    data,
    component = RectShape,
}: RectsLayerProps<TDatum>) => {
    const theme = useTheme();
    const getBorderColor = useInheritedColor<TDatum>(borderColor, theme);

    const { transition } = useRectsTransition<TDatum, { opacity: number }>(
        data,
        {
            enter: datum => ({
                opacity: 0,
                color: datum.color,
                // transform: `translate(${datum.rect.width * datum.depth},)`,
                // borderColor: getBorderColor(datum),
                borderColor: '#ccc',
            }),
            update: datum => ({
                opacity: 1,
                color: datum.color,
                // transform: `translate(${datum.rect.width * datum.depth},)`,

                // borderColor: getBorderColor(datum),
                borderColor: '#ccc',
            }),
            leave: datum => ({
                opacity: 0,
                color: datum.color,
                // transform: `translate(${datum.rect.width * datum.depth},)`,

                // borderColor: getBorderColor(datum),
                borderColor: '#ccc',
            }),
        },
    );

    const Rect: RectComponent<TDatum> = component;

    return (
        <g>
            {transition((transitionProps, datum) => {
                console.log({ datum, transitionProps });

                return createElement(Rect, {
                    key: datum.id,
                    datum,
                    style: {
                        ...transitionProps,
                        borderWidth,
                        // x: datum.depth * datum.rect.width,
                        // transform: datum,
                        width: datum.rect.width,
                        height: datum.rect.height,
                        transform: datum.rect.transform,
                    },
                    onClick,
                    onMouseEnter,
                    onMouseMove,
                    onMouseLeave,
                });
            })}
        </g>
    );
};
