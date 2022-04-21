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
import { defaultIciclesProps } from './props';
import {
    DataProps,
    DatumId,
    IciclesCommonProps,
    IciclesComputedDatum,
    IciclesCustomLayerProps,
} from './types';

const hierarchyRectUseX = <TDatum>(d: HierarchyRectangularNode<TDatum>) =>
    d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);

const hierarchyRectUseY = <TDatum>(d: HierarchyRectangularNode<TDatum>) =>
    d.y1 - d.y0 - Math.min(1, (d.y1 - d.y0) / 2);

const widthHeight = <TDatum>(d: HierarchyRectangularNode<TDatum>) => ({
    topBottom: () => ({
        height: hierarchyRectUseY(d),
        width: hierarchyRectUseX(d),
    }),
    leftRight: () => ({
        height: hierarchyRectUseX(d),
        width: hierarchyRectUseY(d),
    }),
});

export const useIcicles = <RawDatum>({
    data,
    id = defaultIciclesProps.id,
    value = defaultIciclesProps.value,
    valueFormat,
    colors = defaultIciclesProps.colors,
    colorBy = defaultIciclesProps.colorBy,
    inheritColorFromParent = defaultIciclesProps.inheritColorFromParent,
    childColor = defaultIciclesProps.childColor as InheritedColorConfig<
        IciclesComputedDatum<RawDatum>
    >,
    width,
    height,
    direction,
}: {
    childColor?: IciclesCommonProps<RawDatum>['childColor'];
    colorBy?: IciclesCommonProps<RawDatum>['colorBy'];
    colors?: IciclesCommonProps<RawDatum>['colors'];
    data: DataProps<RawDatum>['data'];
    direction: IciclesCommonProps<RawDatum>['direction'];
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

    const isLeftRight = direction === 'left' || direction === 'right';

    const getId = usePropertyAccessor<RawDatum, DatumId>(id);
    const getValue = usePropertyAccessor<RawDatum, number>(value);
    const formatValue = useValueFormatter<number>(valueFormat);

    // https://observablehq.com/@d3/zoomable-icicle
    const {
        nodes,
        baseOffsetTop,
        baseOffsetLeft,
    }: {
        baseOffsetLeft: number;
        baseOffsetTop: number;
        nodes: IciclesComputedDatum<RawDatum>[];
    } = useMemo(() => {
        // d3 mutates the data for performance reasons,
        // however it does not work well with reactive programming,
        // this ensures that we don't mutate the input data
        const clonedData = cloneDeep(data);

        const hierarchy = d3Hierarchy(clonedData)
            .sum(getValue)
            .sort((a, b) => b.height - a.height || b.value! - a.value!);

        const partition = d3Partition<RawDatum>().size(
            isLeftRight ? [height, width] : [width, height],
        );
        // exclude root node
        const descendants = partition(hierarchy).descendants();

        const total = hierarchy.value ?? 0;

        // It's important to sort node by depth,
        // it ensures that we assign a parent node
        // which has already been computed, because parent nodes
        // are going to be computed first
        const sortedNodes = sortBy(descendants, 'depth');

        const rootRect = {
            ...widthHeight(sortedNodes[0])[
                isLeftRight ? 'leftRight' : 'topBottom'
            ](),
        };
        const baseOffsetLeft = direction === 'left' ? width : 0;
        const baseOffsetTop = direction === 'top' ? height : 0;
        const rectOffsetLeft =
            direction === 'left' ? baseOffsetLeft - rootRect.width : 0;
        const rectOffsetTop =
            direction === 'top' ? baseOffsetTop - rootRect.height : 0;

        return {
            baseOffsetLeft,
            baseOffsetTop,
            nodes: sortedNodes.reduce<IciclesComputedDatum<RawDatum>[]>(
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

                    const descRect =
                        widthHeight(descendant)[
                            isLeftRight ? 'leftRight' : 'topBottom'
                        ]();

                    const x0 = isLeftRight ? descendant.y0 : descendant.x0,
                        x1 = isLeftRight ? descendant.y1 : descendant.x1,
                        y0 = isLeftRight ? descendant.x0 : descendant.y0,
                        y1 = isLeftRight ? descendant.x1 : descendant.y1;

                    const transform = `translate(${Math.abs(
                        rectOffsetLeft - x0,
                    )}, ${Math.abs(rectOffsetTop - y0)})`;

                    const rect: Rect = {
                        ...descRect,
                        transform,
                        x0,
                        x1,
                        y0,
                        y1,
                        percentage,
                    };

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
            ),
        };
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
        direction,
        isLeftRight,
    ]);

    return { nodes, baseOffsetLeft, baseOffsetTop };
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
