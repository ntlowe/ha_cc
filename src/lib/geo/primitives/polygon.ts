import {Vertex} from "./vertex";
import {Face} from "./face";

export class Polygon {

    private readonly _vertices: Vertex[];

    constructor(allVertices: Vertex[], face: Face) {
        let vertices = new Array<Vertex>();
        for(let index of face.indexes) {
            vertices.push(allVertices[index])
        }
        this._vertices = vertices;
    }

    get vertices(): Vertex[] {
        return this._vertices;
    }

    area = (): number => {
        let vertices = this._vertices;
        let numVertices = vertices.length;

        let area = 0;
        let j = numVertices-1;

        for (let i=0; i<numVertices; i++)
        { area = area +  (vertices[j].x +vertices[i].x) * (vertices[j].y- vertices[i].y);
            j = i;
        }
        return Math.abs(area / 2);
    }
}