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
                // borderColor: getBorderColor(datum),
                borderColor: '#ccc',
                // width: datum.rect.width,
                // height: datum.rect.height,
            }),
            update: datum => ({
                opacity: 1,
                color: datum.color,
                // borderColor: getBorderColor(datum),
                borderColor: '#ccc',
                // width: datum.rect.width,
                // height: datum.rect.height,
            }),
            leave: datum => ({
                opacity: 0,
                color: datum.color,
                // borderColor: getBorderColor(datum),
                borderColor: '#ccc',
                // width: datum.rect.width,
                // height: datum.rect.height,
            }),
        },
    );

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
                        transform: datum.rect.transform,
                        width: datum.rect.width,
                        height: datum.rect.height,
                    } as any,
                    onClick,
                    onMouseEnter,
                    onMouseMove,
                    onMouseLeave,
                });
            })}
        </g>
    );
};
