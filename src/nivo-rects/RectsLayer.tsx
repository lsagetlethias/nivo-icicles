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
                // color: datum.color,
                // borderColor: getBorderColor(datum),
            }),
            update: datum => ({
                opacity: 1,
                // color: datum.color,
                // borderColor: getBorderColor(datum),
            }),
            leave: datum => ({
                opacity: 0,
                // color: datum.color,
                // borderColor: getBorderColor(datum),
            }),
        },
    );

    console.log({ transition });

    const Rect: RectComponent<TDatum> = component;

    return (
        <g>
            {transition((transitionProps, datum) => {
                return createElement(Rect, {
                    key: datum.id,
                    datum,
                    style: {
                        ...transitionProps,
                        borderWidth,
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