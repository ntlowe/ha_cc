import 'mocha';
import {expect} from "chai";
import {deserialize} from "../lib/geo/io/planargraph";
import {
    getInteriorFaceJsonOfPlanarGraph,
    getInteriorFacesOfPlanarGraph,
} from "./algorithm1";
import {eulersFaceCountCheck} from "../lib/geo/shared/euler";

describe("algorithm 1 - interior faces",function () {

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
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1], [3,2],
   "edges": [[0, 1], [0, 3], [2, 3], [1,4], [2,5], [4,5]]
}`;

    let planarGraph6 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1]],
   "edges": [[0, 1], [0, 3], [2, 3], [1,4], [2,5], [4,5]]
}`;
    let planarGraph7 = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [3,1], [3,2],[5,-1]],
   "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3], [1,4], [2,5],[4,5],[0,6],[6,5]]
}`;


    let testCases = [
        {name:"box with a diagonal", defaultText: planarGraph1,
            expected: {deserializeErr: false, interiorFaceErr: false, faceCount: 2}},
        {name:"box with a diagonal with an added triangle", defaultText: planarGraph2,
            expected: {deserializeErr: false, interiorFaceErr: false, faceCount: 3}},
        {name:"box with a diagonal with an added two-segment shape", defaultText: planarGraph3,
            expected: {deserializeErr: false, interiorFaceErr: false, faceCount: 3}},
        {name:"just the outline", defaultText: planarGraph4,
            expected: {deserializeErr: false, interiorFaceErr: false, faceCount: 1}},
        {name:"edge without a vertex throws an interior face error", defaultText: planarGraph7,
            expected: {deserializeErr: false, interiorFaceErr: false, faceCount: 4}},
        {name:"malformed json throws a deserialization error", defaultText: planarGraph5,
            expected: {deserializeErr: true, interiorFaceErr: false, faceCount: 0}},
        {name:"edge without a vertex throws an interior face error", defaultText: planarGraph6,
            expected: {deserializeErr: false, interiorFaceErr: true, faceCount: 0}},

    ];

    testCases.forEach(function(testCase) {
        it(testCase.name, function () {
            if (testCase.expected.deserializeErr){

                expect(()=>  deserialize(testCase.defaultText)).to.throw(Error);

            } else if (testCase.expected.interiorFaceErr) {

                let planarGraph = deserialize(testCase.defaultText);
                expect(()=>  getInteriorFacesOfPlanarGraph(planarGraph)).to.throw(Error);

            } else {

                let planarGraph = deserialize(testCase.defaultText);
                let eulersFaceCount = eulersFaceCountCheck(planarGraph.vertices.length, planarGraph.edges.length);
                let mesh = getInteriorFacesOfPlanarGraph(planarGraph);

                // check against euler's formula
                expect(mesh.faces.length).to.equal(eulersFaceCount);

                // check against typed value
                expect(mesh.faces.length).to.equal(testCase.expected.faceCount)

                // output json - uncomment to see json payload output
                //console.log(getInteriorFaceJsonOfPlanarGraph(planarGraph))
            }
        })
    })
});


