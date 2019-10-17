import {Edge} from "../primitives/edge";
import {Vertex} from "../primitives/vertex";
import {Line} from "../primitives/line";

export class PlanarGraph {
    private readonly _vertices: Vertex[];
    private readonly _edges: Edge[];

    constructor(vertices: Vertex[], edges: Edge[]) {
        this._vertices = vertices;
        this._edges = edges;
    }

    public get edges(): Edge[] {
        return this._edges;
    }
    public get vertices(): Vertex[] {
        return this._vertices;
    }

    public getLines = (): Line[] => {
        return this._edges.map(this.edgeToLine);
    };

    private edgeToLine = (edge: Edge): Line => {
        let startIndex = edge.startIndex;
        let endIndex = edge.endIndex;
        let vertexStart = this._vertices[startIndex];
        let vertexEnd = this._vertices[endIndex];
        return new Line(vertexStart, vertexEnd);
    };
}