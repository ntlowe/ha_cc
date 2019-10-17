import {Vertex} from "../geo/primitives/vertex";
import {BoundingBox} from "../geo/primitives/boundingbox";
import {Line} from "../geo/primitives/line";
import {Polygon} from "../geo/primitives/polygon";

export class ViewProps {
    viewWidth: number;
    viewHeight: number;
    viewMargin: number;
    defaultText: string;
    jsonToDrawingElements: (json: string) => DrawingElements;
}

export class DomIds {
    buttonId: string;
    domSvgId: string;
    mainContentRowId: string;
    jsonErrLabel: string;
    jsonInputId: string;
}

export function getBoundingBox (vertices: Vertex[]): BoundingBox{
    let bb = new BoundingBox;
    for (let vertex of vertices) {
        bb.addVertex(vertex);
    }
    return bb;
}

export class DrawingElements {
    error: Error;
    vertices: Vertex[];
    lines: Line[];
    polygons: Polygon[];
}