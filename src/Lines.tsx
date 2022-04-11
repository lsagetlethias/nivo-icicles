import { ArcsLayer } from '@nivo/arcs';
import { useTooltip } from '@nivo/tooltip';
import { createElement, useMemo } from 'react';
import * as React from 'react';
import {
    SunburstComputedDatum,
    MouseHandlers,
    IciclesCommonProps,
} from './types';

interface LinesProps<RawDatum> {
    borderColor: IciclesCommonProps<RawDatum>['borderColor'];
    borderWidth: IciclesCommonProps<RawDatum>['borderWidth'];
    data: SunburstComputedDatum<RawDatum>[];
    isInteractive: IciclesCommonProps<RawDatum>['isInteractive'];
    onClick?: MouseHandlers<RawDatum>['onClick'];
    onMouseEnter?: MouseHandlers<RawDatum>['onMouseEnter'];
    onMouseLeave?: MouseHandlers<RawDatum>['onMouseLeave'];
    onMouseMove?: MouseHandlers<RawDatum>['onMouseMove'];
    tooltip: IciclesCommonProps<RawDatum>['tooltip'];
}

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
            datum: SunburstComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            onClick?.(datum, event);
        };
    }, [isInteractive, onClick]);

    const handleMouseEnter = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: SunburstComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            showTooltipFromEvent(createElement(tooltip, datum), event);
            onMouseEnter?.(datum, event);
        };
    }, [isInteractive, showTooltipFromEvent, tooltip, onMouseEnter]);

    const handleMouseMove = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: SunburstComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            showTooltipFromEvent(createElement(tooltip, datum), event);
            onMouseMove?.(datum, event);
        };
    }, [isInteractive, showTooltipFromEvent, tooltip, onMouseMove]);

    const handleMouseLeave = useMemo(() => {
        if (!isInteractive) return undefined;

        return (
            datum: SunburstComputedDatum<RawDatum>,
            event: React.MouseEvent<SVGPathElement>,
        ) => {
            hideTooltip();
            onMouseLeave?.(datum, event);
        };
    }, [isInteractive, hideTooltip, onMouseLeave]);

    return (
        <ArcsLayer<SunburstComputedDatum<RawDatum>>
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
