import { Arc, useArcGenerator } from '@nivo/arcs';
import {
    useOrdinalColorScale,
    useInheritedColor,
    InheritedColorConfig,
} from '@nivo/colors';
import { usePropertyAccessor, useTheme, useValueFormatter } from '@nivo/core';
import {
    partition as d3Partition,
    hierarchy as d3Hierarchy,
    HierarchyRectangularNode,
} from 'd3-hierarchy';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { useMemo } from 'react';
import { Rect } from './nivo-rects/types';
import { defaultProps } from './props';
import {
    SunburstComputedDatum,
    SunburstCommonProps,
    DataProps,
    DatumId,
    SunburstCustomLayerProps,
    IciclesCommonProps,
    IciclesComputedDatum,
    IciclesCustomLayerProps,
} from './types';

export const useSunburst = <RawDatum>({
    data,
    id = defaultProps.id,
    value = defaultProps.value,
    valueFormat,
    radius,
    cornerRadius = defaultProps.cornerRadius,
    colors = defaultProps.colors,
    colorBy = defaultProps.colorBy,
    inheritColorFromParent = defaultProps.inheritColorFromParent,
    childColor = defaultProps.childColor as InheritedColorConfig<
        SunburstComputedDatum<RawDatum>
    >,
}: {
    childColor?: SunburstCommonProps<RawDatum>['childColor'];
    colorBy?: SunburstCommonProps<RawDatum>['colorBy'];
    colors?: SunburstCommonProps<RawDatum>['colors'];
    cornerRadius?: SunburstCommonProps<RawDatum>['cornerRadius'];
    data: DataProps<RawDatum>['data'];
    id?: DataProps<RawDatum>['id'];
    inheritColorFromParent?: SunburstCommonProps<RawDatum>['inheritColorFromParent'];
    radius: number;
    value?: DataProps<RawDatum>['value'];
    valueFormat?: DataProps<RawDatum>['valueFormat'];
}) => {
    const theme = useTheme();
    const getColor = useOrdinalColorScale<
        Omit<SunburstComputedDatum<RawDatum>, 'color' | 'fill'>
    >(colors, colorBy);
    const getChildColor = useInheritedColor<SunburstComputedDatum<RawDatum>>(
        childColor,
        theme,
    );

    const getId = usePropertyAccessor<RawDatum, DatumId>(id);
    const getValue = usePropertyAccessor<RawDatum, number>(value);
    const formatValue = useValueFormatter<number>(valueFormat);

    const nodes: SunburstComputedDatum<RawDatum>[] = useMemo(() => {
        // d3 mutates the data for performance reasons,
        // however it does not work well with reactive programming,
        // this ensures that we don't mutate the input data
        const clonedData = cloneDeep(data);

        const hierarchy = d3Hierarchy(clonedData).sum(getValue);

        const partition = d3Partition<RawDatum>().size([
            2 * Math.PI,
            radius * radius,
        ]);
        // exclude root node
        const descendants = partition(hierarchy).descendants();

        const total = hierarchy.value ?? 0;

        // It's important to sort node by depth,
        // it ensures that we assign a parent node
        // which has already been computed, because parent nodes
        // are going to be computed first
        const sortedNodes = sortBy(descendants, 'depth');

        return sortedNodes.reduce<SunburstComputedDatum<RawDatum>[]>(
            (acc, descendant) => {
                const id = getId(descendant.data);
                // d3 hierarchy node value is optional by default as it depends on
                // a call to `count()` or `sum()`, and we previously called `sum()`,
                // d3 typings could be improved and make it non optional when calling
                // one of those.

                const value = descendant.value!;
                const percentage = (100 * value) / total;
                const path = descendant
                    .ancestors()
                    .map(ancestor => getId(ancestor.data));

                const arc: Arc = {
                    startAngle: descendant.x0,
                    endAngle: descendant.x1,
                    innerRadius: Math.sqrt(descendant.y0),
                    outerRadius: Math.sqrt(descendant.y1),
                };

                let parent: SunburstComputedDatum<RawDatum> | undefined;
                if (descendant.parent) {
                    // as the parent is defined by the input data, and we sorted the data
                    // by `depth`, we can safely assume it's defined.

                    parent = acc.find(
                        node => node.id === getId(descendant.parent!.data),
                    );
                }

                const normalizedNode: SunburstComputedDatum<RawDatum> = {
                    id,
                    path,
                    value,
                    percentage,
                    formattedValue: valueFormat
                        ? formatValue(value)
                        : `${percentage.toFixed(2)}%`,
                    color: '',
                    arc,
                    data: descendant.data,
                    depth: descendant.depth,
                    height: descendant.height,
                };

                if (
                    inheritColorFromParent &&
                    parent &&
                    normalizedNode.depth > 1
                ) {
                    normalizedNode.color = getChildColor(
                        parent,
                        normalizedNode,
                    );
                } else {
                    normalizedNode.color = getColor(normalizedNode);
                }

                return [...acc, normalizedNode];
            },
            [],
        );
    }, [
        data,
        radius,
        getValue,
        getId,
        valueFormat,
        formatValue,
        getColor,
        inheritColorFromParent,
        getChildColor,
    ]);

    const arcGenerator = useArcGenerator({ cornerRadius });

    return { arcGenerator, nodes };
};

/**
 * Memoize the context to pass to custom layers.
 */
export const useSunburstLayerContext = <RawDatum>({
    nodes,
    arcGenerator,
    centerX,
    centerY,
    radius,
}: SunburstCustomLayerProps<RawDatum>): SunburstCustomLayerProps<RawDatum> =>
    useMemo(
        () => ({
            nodes,
            arcGenerator,
            centerX,
            centerY,
            radius,
        }),
        [nodes, arcGenerator, centerX, centerY, radius],
    );

// --------
// --------
// --------
// --------
// --------
// --------
// --------
// --------
// --------
// --------

const hierarchyRectHorizontal = <TDatum>(d: HierarchyRectangularNode<TDatum>) =>
    d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);

const hierarchyRectVertical = <TDatum>(d: HierarchyRectangularNode<TDatum>) =>
    d.y1 - d.y0 - Math.min(1, (d.y1 - d.y0) / 2);

export const useIcicles = <RawDatum>({
    data,
    id = defaultProps.id,
    value = defaultProps.value,
    valueFormat,
    colors = defaultProps.colors,
    colorBy = defaultProps.colorBy,
    inheritColorFromParent = defaultProps.inheritColorFromParent,
    childColor = defaultProps.childColor as InheritedColorConfig<
        IciclesComputedDatum<RawDatum>
    >,
    width,
    height,
}: {
    childColor?: IciclesCommonProps<RawDatum>['childColor'];
    colorBy?: IciclesCommonProps<RawDatum>['colorBy'];
    colors?: IciclesCommonProps<RawDatum>['colors'];
    data: DataProps<RawDatum>['data'];
    height: IciclesCommonProps<RawDatum>['height'];
    id?: DataProps<RawDatum>['id'];
    inheritColorFromParent?: IciclesCommonProps<RawDatum>['inheritColorFromParent'];
    value?: DataProps<RawDatum>['value'];
    valueFormat?: DataProps<RawDatum>['valueFormat'];
    width: IciclesCommonProps<RawDatum>['width'];
}) => {
    const theme = useTheme();
    const getColor = useOrdinalColorScale<
        Omit<IciclesComputedDatum<RawDatum>, 'color' | 'fill'>
    >(colors, colorBy);
    const getChildColor = useInheritedColor<IciclesComputedDatum<RawDatum>>(
        childColor,
        theme,
    );

    const getId = usePropertyAccessor<RawDatum, DatumId>(id);
    const getValue = usePropertyAccessor<RawDatum, number>(value);
    const formatValue = useValueFormatter<number>(valueFormat);

    // https://observablehq.com/@d3/zoomable-icicle
    const nodes: IciclesComputedDatum<RawDatum>[] = useMemo(() => {
        // d3 mutates the data for performance reasons,
        // however it does not work well with reactive programming,
        // this ensures that we don't mutate the input data
        const clonedData = cloneDeep(data);

        const hierarchy = d3Hierarchy(clonedData)
            .sum(getValue)
            .sort((a, b) => b.height - a.height || b.value! - a.value!);

        const partition = d3Partition<RawDatum>().size([width, height]); // Mode horizontal
        // const partition = d3Partition<RawDatum>().size([height, width]); // Mode horizontal
        // exclude root node
        const descendants = partition(hierarchy).descendants();

        const total = hierarchy.value ?? 0;

        // It's important to sort node by depth,
        // it ensures that we assign a parent node
        // which has already been computed, because parent nodes
        // are going to be computed first
        const sortedNodes = sortBy(descendants, 'depth');

        return sortedNodes.reduce<IciclesComputedDatum<RawDatum>[]>(
            (acc, descendant) => {
                const id = getId(descendant.data);
                // d3 hierarchy node value is optional by default as it depends on
                // a call to `count()` or `sum()`, and we previously called `sum()`,
                // d3 typings could be improved and make it non optional when calling
                // one of those.

                const value = descendant.value!;
                const percentage = (100 * value) / total;
                const path = descendant
                    .ancestors()
                    ?.map(ancestor => getId(ancestor.data));

                console.log('descendant ', descendant.x0, descendant.y0);

                // VERTICAL
                const transform = `translate(${descendant.y0}, ${descendant.x0})`;
                // const width = window.innerWidth * 0.1;

                const rect: Rect = {
                    height: hierarchyRectHorizontal(descendant),
                    width: hierarchyRectVertical(descendant),
                    // width: descendant.y1 - descendant.y0 - 1,
                    transform,
                };
                // console.log(rect);

                // HORIZONTAL
                // const transform = `translate(${descendant.x0}, ${descendant.y0})`;

                // const rect: Rect = {
                //     height: hierarchyRectVertical(descendant),
                //     width: hierarchyRectHorizontal(descendant),
                //     // width: descendant.y1 - descendant.y0 - 1,
                //     transform,
                // };

                let parent: IciclesComputedDatum<RawDatum> | undefined;
                if (descendant.parent) {
                    // as the parent is defined by the input data, and we sorted the data
                    // by `depth`, we can safely assume it's defined.

                    parent = acc.find(
                        node => node.id === getId(descendant.parent!.data),
                    );
                }

                const normalizedNode: IciclesComputedDatum<RawDatum> = {
                    id,
                    path,
                    value,
                    percentage,
                    rect,
                    formattedValue: valueFormat
                        ? formatValue(value)
                        : `${percentage.toFixed(2)}%`,
                    color: '',
                    data: descendant.data,
                    depth: descendant.depth,
                    height: descendant.height,
                    transform,
                };

                if (
                    inheritColorFromParent &&
                    parent &&
                    normalizedNode.depth > 1
                ) {
                    normalizedNode.color = getChildColor(
                        parent,
                        normalizedNode,
                    );
                } else {
                    normalizedNode.color = getColor(normalizedNode);
                }

                // normalizedNode.color = getColor(normalizedNode);

                return [...acc, normalizedNode];
            },
            [],
        );
    }, [
        data,
        getValue,
        getId,
        valueFormat,
        formatValue,
        getColor,
        inheritColorFromParent,
        getChildColor,
        width,
        height,
    ]);

    return { nodes };
};

/**
 * Memoize the context to pass to custom layers.
 */
export const useIciclesLayerContext = <RawDatum>({
    nodes,
}: IciclesCustomLayerProps<RawDatum>): IciclesCustomLayerProps<RawDatum> =>
    useMemo(
        () => ({
            nodes,
        }),
        [nodes],
    );
