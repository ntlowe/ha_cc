import {Vertex} from "./vertex";

export class BoundingBox {
    private _min: Vertex | undefined;
    private _max: Vertex | undefined;

    private _firstVertexAdded = false;

    public get max (): Vertex | undefined {
        if (this._firstVertexAdded) {
            return this._max;
        } else {return undefined}
    };

    public get min(): Vertex | undefined {
        if (this._firstVertexAdded) {
            return this._min;
        } else {return undefined}
    }

    public addVertex = (vertex: Vertex) => {
        if (!this._firstVertexAdded) {
            this._min = vertex;
            this._max = vertex;
            this._firstVertexAdded = true;
            return
        }

        if (this._min != undefined && this._max != undefined) {
            let minX = Math.min(this._min.x, vertex.x);
            let minY = Math.min(this._min.y, vertex.y);

            let maxX = Math.max(this._max.x, vertex.x);
            let maxY = Math.max(this._max.y, vertex.y);

            this._min = new Vertex(minX, minY);
            this._max = new Vertex(maxX, maxY);
        }
    };
}