import {expect} from "chai";
import {findNeighboringFacesOfSingleFace, generateEdgeHashes} from "./algorithm2";
import {Face} from "../lib/geo/primitives/face";
import {deserialize} from "../lib/geo/io/planargraph";
import {getInteriorFacesOfPlanarGraph} from "./algorithm1";

describe("algorithm 2 - find neighboring interior face indexes",function () {

    let planarGraph1 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2]],
   "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}`;

    let planarGraph2 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1]],
   "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3],[1,4],[2,4]]
}`;

    let planarGraph3 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1], [3,2]],
   "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3], [1,4], [2,5],[4,5]]
}`;

    let planarGraph4 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1], [3,2]],
   "edges": [[0, 1], [0, 3], [2, 3], [1,4], [2,5], [4,5]]
}`;
    let planarGraph5 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1], [3,2],[5,-1]],
   "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3], [1,4], [2,5],[4,5],[0,6],[6,5]]
}`;

    let testCases = [
        {name:"face chosen in box with a diagonal yields 1 neighboring face",
            args: {shapeJson: planarGraph1, index: 0}, expected: [1]},
        {name:"... box with a diagonal with an added triangle yields 2",
            args: {shapeJson: planarGraph2, index: 0}, expected: [2,1]},
        {name:"... box with a diagonal with an added triangle yields 1",
            args: {shapeJson: planarGraph2, index: 1}, expected: [0]},
        {name:"... box with a diagonal with an added two-segment shape yield 1",
            args: {shapeJson: planarGraph3, index: 2}, expected: [0]},
        {name:"... just the outline yields 0 neighbors",
            args: {shapeJson: planarGraph4, index: 0}, expected: []},
        {name:"... a more complex shape yields 3 neighbors",
            args: {shapeJson: planarGraph5, index: 0}, expected: [1,2,3]},
        {name:"... a more complex shape yields 1 neighbor",
            args: {shapeJson: planarGraph5, index: 1}, expected: [0]},
        {name:"... a more complex shape yields 2 neighbors",
            args: {shapeJson: planarGraph5, index: 2}, expected: [0,3]}
    ];

    testCases.forEach(function(testCase) {
        it(testCase.name, function () {

            let planarGraph = deserialize(testCase.args.shapeJson);
            let mesh = getInteriorFacesOfPlanarGraph(planarGraph);
            let neighborIndexes = findNeighboringFacesOfSingleFace(mesh.faces, testCase.args.index);

            expect(neighborIndexes.length).to.equal(testCase.expected.length);

            for(let i = 0; i < neighborIndexes.length; i++) {
                let actualHash = neighborIndexes[i];
                expect(testCase.expected.indexOf(actualHash) > -1).to.be.true;
            }

            // output json - uncomment to see json
            //console.log(neighborIndexes.toString());
        })
    })
});

describe("generate edge hash",function () {

    let testCases = [
        {name:"4 index face", face: new Face([0,1,2,0]),
            expected: {hashes: ["0,1","1,2","0,2"], hashCount: 3}},
        {name:"5 index face", face: new Face([0,1,3,10,0]),
            expected: {hashes: ["0,1","1,3","3,10","0,10"], hashCount: 4}},
    ];

    testCases.forEach(function(testCase) {
        it(testCase.name, function () {
           let hashes = generateEdgeHashes(testCase.face);

           expect(hashes.length).to.equal(testCase.expected.hashCount);

            for(let i = 0; i < hashes.length; i++) {
                let expectedHash = testCase.expected.hashes[i];
                let actualHash = hashes[i];
                expect(actualHash).to.equal(expectedHash);
            }
        })
    })
});



