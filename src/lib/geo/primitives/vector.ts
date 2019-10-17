import {InstantiationError} from "../../errors/types";

export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {

        if (x == null) {
            throw new InstantiationError("vertex x cannot be null")
        }
        if (y == null) {
            throw new InstantiationError("vertex y cannot be null")
        }

        this.x = x;
        this.y = y;
    }
}

// the angle clockwise from vector1 to a vector 2
export function angleBetweenVectorsCW(vec1: Vector, vec2: Vector): number {

    let dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
    let determinant = vec1.x * vec2.y - vec1.y * vec2.x;
    let angle = Math.atan2(determinant, dotProduct);

    if (angle == 0) return 0;
    if (Math.abs(angle) == Math.PI) return Math.PI;
    if (angle < 0) return Math.abs(angle);
    return  2 * Math.PI - angle;
}