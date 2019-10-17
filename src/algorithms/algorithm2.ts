import {Face} from "../lib/geo/primitives/face";

//
//  ALGORITHM 2 - FIND NEIGHBORING FACES
//

// main algorithm logic
export function findNeighboringFacesOfSingleFace(faces: Face[], searchFaceIndex: number): number[] {

    if (searchFaceIndex > faces.length) throw new Error("face index out of the range of given face array");
    let searchFace = faces[searchFaceIndex];

    let retrievedFaceIndices = new Array<number>();

    // generate a numerically-sorted hash that produces the same string regardless of edge orientation
    let hashes = generateEdgeHashes(searchFace);

    // for each edge, search on the hash
    for (let edgeHash of hashes) {
        for (let i =0; i < faces.length; i++) {

            // ignore faces that have already been retrieved
            if (retrievedFaceIndices.indexOf(i) > -1) continue;

            // ignore index for the search face
            if (i == searchFaceIndex) continue;

            let face = faces[i];

            // generate corresponding hash for all edges on face and check if contains the current edge hash
            let otherFaceHashes = generateEdgeHashes(face);
            if (otherFaceHashes.indexOf(edgeHash) > -1) {
                retrievedFaceIndices.push(i);
                // break on first found
                break;
            }
        }
    }
    return retrievedFaceIndices;
}


//   e.g. both Edge[0,1] and Edge[1,0] would produce `0,1`
export function generateEdgeHashes(face: Face): string[] {

    let edgeHashes = new Array<string>();
    let faceIndices = face.indexes;

    for (let i = 0; i < faceIndices.length - 1; i++) {
        let edgeHash = generateDirectionAgnosticHash(faceIndices[i],faceIndices[i+1])
        edgeHashes.push(edgeHash);
    }

    return edgeHashes;
}

// collect an array of directionally agnostic string hashes
export function generateDirectionAgnosticHash(...items: number[]): string {
    items.sort((a, b) => a - b);
    return items.toString();
}