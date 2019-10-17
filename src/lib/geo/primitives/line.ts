import {Vertex} from "./vertex";
import {InstantiationError} from "../../errors/types";
import {angleBetweenVectorsCW, Vector} from "./vector";

export class Line {
    public startVertex: Vertex;
    public endVertex: Vertex;

    constructor(startVertex: Vertex, endVertex: Vertex) {

        if (startVertex == null) {
            throw new InstantiationError(`line start vertex cannot be null`);
        }
        if (endVertex == null) {
            throw new InstantiationError(`line end vertex cannot be null`);
        }

        this.startVertex = startVertex;
        this.endVertex = endVertex;
    }
}

export function toVector(line: Line): Vector {
    let x = line.endVertex.x - line.startVertex.x;
    let y = line.endVertex.y - line.startVertex.y;
    return new Vector(x, y);
}

// the angle clockwise from vector1 to a vector 2
export function angleBetweenLinesCW(line1: Line, line2: Line): number {
    let vec1 = toVector(line1);
    let vec2 = toVector(line2);
    return angleBetweenVectorsCW(vec1,vec2);
}