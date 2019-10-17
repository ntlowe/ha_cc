import {PlanarGraph} from "../topologies/planargraph";
import {Vertex} from "../primitives/vertex";
import {Edge} from "../primitives/edge";
import {ClassificationError, DeserializeError} from "../../errors/types";
import {getInteriorFacesOfPlanarGraph} from "../../../algorithms/algorithm1";
import {DrawingElements} from "../../view/viewprops";


// validation around deserialization
export function deserialize(json: string): PlanarGraph {
    let rawObject = JSON.parse(json);
    if (!rawObject.hasOwnProperty("vertices")) {
        throw new DeserializeError("json object must have `vertices` key");
    }
    if (!rawObject.hasOwnProperty("edges")) {
        throw new DeserializeError("json object must have `edges` key");
    }
    let vertices = rawObject.vertices.map(toVertex);
    let edges = rawObject.edges.map(toEdge);
    return new PlanarGraph(vertices, edges);
}

export function toVertex(vertexVals: any[]): Vertex {
    return new Vertex(vertexVals[0],vertexVals[1])
}

export function toEdge(vertexVals: any[]): Edge {
    return new Edge(vertexVals[0],vertexVals[1])
}

// convert planar graph to elements to be drawn in svg
export function jsonToDrawingElements(json: string): DrawingElements {
    let de = new DrawingElements();
    let planarGraph: PlanarGraph;
    try {
        planarGraph = deserialize(json);
        de.vertices = planarGraph.vertices;
        de.lines = planarGraph.getLines();
    } catch (err) {
        de.error = err;
        return de;
    }

    try {
        let mesh = getInteriorFacesOfPlanarGraph(planarGraph);
        de.polygons = mesh.facesAsPolygons();
    } catch (err) {
        de.error = new ClassificationError("could not classify the interior faces of the planar graph");
        return de;
    }

    return de;
}

