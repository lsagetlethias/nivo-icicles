import { useMotionConfig } from '@nivo/core';
import { useTransition } from '@react-spring/web';
import { useMemo } from 'react';
import { DatumWithRect, DatumWithRectAndColor } from './types';

export interface TransitionExtra<TDatum extends DatumWithRect, ExtraProps> {
    enter: (datum: TDatum) => ExtraProps;
    leave: (datum: TDatum) => ExtraProps;
    update: (datum: TDatum) => ExtraProps;
}

// TODO: mode ?
export const useRectExtraTransition = <
    TDatum extends DatumWithRect,
    ExtraProps,
>(
    extraTransition?: TransitionExtra<TDatum, ExtraProps>,
) =>
    useMemo(
        () => ({
            enter: (datum: TDatum) => ({
                progress: 0,
                x0: datum.rect.x0,
                x1: datum.rect.x1,
                y0: datum.rect.y0,
                y1: datum.rect.y1,
                width: datum.rect.width,
                height: datum.rect.height,
                ...(extraTransition?.enter(datum) ?? {}),
            }),
            update: (datum: TDatum) => ({
                progress: 1,
                x0: datum.rect.x0,
                x1: datum.rect.x1,
                y0: datum.rect.y0,
                y1: datum.rect.y1,
                width: datum.rect.width,
                height: datum.rect.height,
                ...(extraTransition?.update(datum) ?? {}),
            }),
            leave: (datum: TDatum) => ({
                progress: 0,
                x0: datum.rect.x0,
                x1: datum.rect.x1,
                y0: datum.rect.y0,
                y1: datum.rect.y1,
                width: datum.rect.width,
                height: datum.rect.height,
                ...(extraTransition?.leave(datum) ?? {}),
            }),
        }),
        [extraTransition],
    );

export const useRectsTransition = <
    TDatum extends DatumWithRectAndColor,
    ExtraProps = unknown,
>(
    data: TDatum[],
    extra?: TransitionExtra<TDatum, ExtraProps>,
) => {
    const { animate, config: springConfig } = useMotionConfig();

    const phases = useRectExtraTransition<TDatum, ExtraProps>(extra);

    const transition = useTransition<
        TDatum,
        {
            height: number;
            progress: number;
            width: number;
            x0: number;
            x1: number;
            y0: number;
            y1: number;
        } & ExtraProps
    >(data, {
        keys: datum => datum.id,
        initial: phases.update,
        from: phases.enter,
        enter: phases.update,
        leave: phases.leave,
        config: springConfig,
        immediate: !animate,
    });

    return { transition };
};
