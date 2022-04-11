export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    height: number;
    width: number;
}

export interface DatumWithRect {
    id: string | number;
    rect: Rect;
}

export interface DatumWithRectAndColor extends DatumWithRect {
    color: string;
    fill?: string;
}