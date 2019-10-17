import {InstantiationError} from "../../errors/types";

export class Vertex {
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
