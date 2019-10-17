import {Vertex} from "../primitives/vertex";
import {Face} from "../primitives/face";
import {Polygon} from "../primitives/polygon";

export class Mesh {

    private readonly _vertices : Vertex[];
    private readonly _faces: Face[];

    constructor(vertices: Vertex[], faces: Face[]) {
        this._vertices = vertices;
        this._faces = faces;
    }

    get vertices(): Vertex[] {
        return this._vertices;
    }

    get faces(): Face[] {
        return this._faces;
    }

    public facesAsPolygons = (): Polygon[] => {
        let polygons = new Array<Polygon>();
        for (let face of this._faces) {
            polygons.push(new Polygon(this._vertices, face));
        }
        return polygons;
    };
}