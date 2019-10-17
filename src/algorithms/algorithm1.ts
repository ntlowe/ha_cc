import {PlanarGraph} from "../lib/geo/topologies/planargraph";
import {Mesh} from "../lib/geo/topologies/mesh";
import {Face} from "../lib/geo/primitives/face";
import {Edge, getInverse} from "../lib/geo/primitives/edge";
import {angleBetweenLinesCW, Line} from "../lib/geo/primitives/line";
import {ClassificationError} from "../lib/errors/types";

//
//  ALGORITHM 1 - INTERIOR FACES
//

// with JSON output per requirements
export function getInteriorFaceJsonOfPlanarGraph(planarGraph: PlanarGraph): string {
    let mesh = getInteriorFacesOfPlanarGraph(planarGraph);
    return JSON.stringify(mesh)
}

// main algorithm logic
export function getInteriorFacesOfPlanarGraph (planarGraph: PlanarGraph): Mesh {

    let vertices = planarGraph.vertices;

    // initialize face array and count half edges as they are traversed
    let faces = new Array<Face>();
    let traversedHalfEdgeCount = 0;

    // create a map of directed half-edges (2 for each edge pointing in each direction)
    let directedHalfEdgeMap = createDirectedHalfEdgeMap(planarGraph.edges);
    let directedHalfEdgeMapSize = planarGraph.edges.length * 2;

    // until all of the half-edges have been traversed continue to find faces
    while(traversedHalfEdgeCount < directedHalfEdgeMapSize) {

        let startIndex: number;
        let endIndex: number;

        // iterate through all the value arrays per each key, taking the first unused half-edge
        outerLoop:
        for (let directedStartIndex of directedHalfEdgeMap.keys()) {
            for (let directedEndIndex of directedHalfEdgeMap.get(directedStartIndex)) {

                // due to the efficiency cost of removing items from arrays
                //   a simple flag is used to indicate whether a directed half-edge has been visited
                if (directedEndIndex.flag == true) {
                    continue;
                }
                directedEndIndex.flag = true;
                traversedHalfEdgeCount++;

                // set the first half-edge of the new face
                startIndex = directedStartIndex;
                endIndex = directedEndIndex.num;
                break outerLoop;
            }
        }

        // initialize array for storing vertex indexes for the face
        let currentFaceIndexes = new Array<number>();

        // first line is always a keeper
        currentFaceIndexes.push(startIndex);
        currentFaceIndexes.push(endIndex);

        // store first index
        let firstInFaceIndex = startIndex;
        while (endIndex != firstInFaceIndex) {

            // flip previous line to measure angle at intersection rather than head to tail
            let previousLine = new Line(vertices[endIndex], vertices[startIndex]);
            let nextStartIndex = endIndex;

            // 7 is larger than 2*PI, so it represents the largest value possible
            const angleNotSet = 7;
            let minAngle = angleNotSet;
            let minAngleEndIndex: IndexWFlag;

            // get all vertices which are connected to current vertex and traveling away from the vertex
            for (let potentialEndIndex of directedHalfEdgeMap.get(nextStartIndex)) {
                if (potentialEndIndex.flag == true) {
                    continue;
                }

                // flip the vertices to get the angle at the vertex between the two
                let nextLine = new Line(vertices[nextStartIndex], vertices[potentialEndIndex.num]);
                let angle = angleBetweenLinesCW(previousLine, nextLine);
                if (angle == 0) {
                    continue;
                }

                // if the angle is less than any of the previous, store it as the favored angle
                if (angle < minAngle) {
                    minAngle = angle;
                    minAngleEndIndex = potentialEndIndex;
                }
            }

            // if none of the angles were accepted then the graph is not traverse-able
            if (minAngle == angleNotSet) throw new ClassificationError("the planar graph structure is not traverse-able");

            // mark the directed half-edge as traversed
            minAngleEndIndex.flag = true;

            // add the vertex index to the face list and increment the traversed counter
            currentFaceIndexes.push(minAngleEndIndex.num);
            traversedHalfEdgeCount++;

            // setup indices for next iteration
            startIndex = endIndex;
            endIndex = minAngleEndIndex.num;
        }

        let face = new Face(currentFaceIndexes);
        faces.push(face);
    }

    return removeLargestOuterFaceFromMesh(new Mesh(vertices, faces));
}

// create a map of directed half-edges (2 for each edge pointing in each direction)
export function createDirectedHalfEdgeMap (edges: Edge[]):Map<number,IndexWFlag[]> {

    let map = new Map();
    for( let edge of edges) {
        addDirectedEdgeToMap(edge, map);
        addDirectedEdgeToMap(getInverse(edge), map);
    }
    return map;
}

// add the edges to the map as an array of possible vertices to each source vertex
export function addDirectedEdgeToMap(edge: Edge, map: Map<number,IndexWFlag[]>) {
    let startIndex = edge.startIndex;
    let endIndex = edge.endIndex;

    if (!map.has(startIndex)) {
        // if key does not exist, start array
        let array = new Array<IndexWFlag>();
        array.push(new IndexWFlag(endIndex));
        map.set(startIndex, array)
    } else {
        // if key does exist, add to array
        let existArray = map.get(startIndex);
        (<Array<IndexWFlag>>existArray).push(new IndexWFlag(endIndex));
    }
}

// the largest outside face overlaps the other interior faces, remove it
export function removeLargestOuterFaceFromMesh(meshWithLargestFace: Mesh): Mesh {
    let polygons = meshWithLargestFace.facesAsPolygons();

    let faces = meshWithLargestFace.faces;
    if (polygons.length != faces.length) throw new Error("polygon and face length do not match");

    let largestPolygonIndex: number;
    let maxArea = 0;
    let index = 0;
    for (let polygon of polygons) {
        let area = polygon.area();
        if (area > maxArea) {
            maxArea = area;
            largestPolygonIndex = index;
        }
        index++;
    }

    faces.splice(largestPolygonIndex,1)

    return new Mesh(meshWithLargestFace.vertices, faces);
}

// stores the index and also whether the index has been visited before
export class IndexWFlag {

    private readonly _num: number;
    private _flag: boolean;

    constructor(num: number) {
        this._num = num;
        this._flag = false;
    }

    get num(): number {
        return this._num;
    }
    get flag(): boolean {
        return this._flag;
    }

    set flag(value: boolean) {
        this._flag = value;
    }
}