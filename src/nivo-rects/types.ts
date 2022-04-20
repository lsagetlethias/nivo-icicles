export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    height: number;
    transform: string;
    transformText: string;
    width: number;
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}

export interface DatumWithRect {
    id: string | number;
    rect: Rect;
}

export interface DatumWithRectAndColor extends DatumWithRect {
    color: string;
    fill?: string;
}
