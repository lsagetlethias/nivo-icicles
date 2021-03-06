import { ArcGenerator, ArcsLayer } from '@nivo/arcs';
import { useTooltip } from '@nivo/tooltip';
import { createElement, useMemo } from 'react';
import * as React from 'react';
import { ComputedDatum, SunburstCommonProps, MouseHandlers, IciclesCommonProps } from './types';

interface ArcsProps<RawDatum> {
    arcGenerator: ArcGenerator;
    borderColor: SunburstCommonProps<RawDatum>['borderColor'];
    borderWidth: SunburstCommonProps<RawDatum>['borderWidth'];
    center: [number, number];
    data: ComputedDatum<RawDatum>[];
    isInteractive: SunburstCommonProps<RawDatum>['isInteractive'];
    onClick?: MouseHandlers<RawDatum>['onClick'];
    onMouseEnter?: MouseHandlers<RawDatum>['onMouseEnter'];
    onMouseLeave?: MouseHandlers<RawDatum>['onMouseLeave'];
    onMouseMove?: MouseHandlers<RawDatum>['onMouseMove'];
    tooltip: SunburstCommonProps<RawDatum>['tooltip'];
    transitionMode: SunburstCommonProps<RawDatum>['transitionMode'];
}
interface LinesProps<RawDatum> {
    borderColor: IciclesCommonProps<RawDatum>['borderColor'];
    borderWidth: IciclesCommonProps<RawDatum>['borderWidth'];
    data: ComputedDatum<RawDatum>[];
    isInteractive: IciclesCommonProps<RawDatum>['isInteractive'];
    onClick?: MouseHandlers<RawDatum>['onClick'];
    onMouseEnter?: MouseHandlers<RawDatum>['onMouseEnter'];
    onMouseLeave?: MouseHandlers<RawDatum>['onMouseLeave'];
    onMouseMove?: MouseHandlers<RawDatum>['onMouseMove'];
    tooltip: IciclesCommonProps<RawDatum>['tooltip'];
}

export const Arcs = <RawDatum,>({
    center,
    data,
    arcGenerator,
    borderWidth,
    borderColor,
    isInteractive,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    tooltip,
    transitionMode,
}: ArcsProps<RawDatum>) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();

    const handleClick = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            onClick?.(datum, event);
        };
    }, [isInteractive, onClick]);

    const handleMouseEnter = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            showTooltipFromEvent(createElement(tooltip, datum), event);
            onMouseEnter?.(datum, event);
        };
    }, [isInteractive, showTooltipFromEvent, tooltip, onMouseEnter]);

    const handleMouseMove = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            showTooltipFromEvent(createElement(tooltip, datum), event);
            onMouseMove?.(datum, event);
        };
    }, [isInteractive, showTooltipFromEvent, tooltip, onMouseMove]);

    const handleMouseLeave = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            hideTooltip();
            onMouseLeave?.(datum, event);
        };
    }, [isInteractive, hideTooltip, onMouseLeave]);

    return (
        <ArcsLayer<ComputedDatum<RawDatum>>
            center={center}
            data={data}
            arcGenerator={arcGenerator}
            borderWidth={borderWidth}
            borderColor={borderColor}
            transitionMode={transitionMode}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
};

export const Lines = <RawDatum,>({
    data,
    borderWidth,
    borderColor,
    isInteractive,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    tooltip,
}: LinesProps<RawDatum>) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();

    const handleClick = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            onClick?.(datum, event);
        };
    }, [isInteractive, onClick]);

    const handleMouseEnter = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            showTooltipFromEvent(createElement(tooltip, datum), event);
            onMouseEnter?.(datum, event);
        };
    }, [isInteractive, showTooltipFromEvent, tooltip, onMouseEnter]);

    const handleMouseMove = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            showTooltipFromEvent(createElement(tooltip, datum), event);
            onMouseMove?.(datum, event);
        };
    }, [isInteractive, showTooltipFromEvent, tooltip, onMouseMove]);

    const handleMouseLeave = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: ComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            hideTooltip();
            onMouseLeave?.(datum, event);
        };
    }, [isInteractive, hideTooltip, onMouseLeave]);

    return (
        <ArcsLayer<ComputedDatum<RawDatum>>
            center={center}
            data={data}
            arcGenerator={arcGenerator}
            borderWidth={borderWidth}
            borderColor={borderColor}
            transitionMode={transitionMode}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
};
