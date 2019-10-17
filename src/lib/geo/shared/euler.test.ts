import {expect} from "chai";
import {eulersFaceCountCheck} from "./euler";

describe("eulersFaceCount",function ()  {

   let testCases = [
       {name: "4 vertices and 5 edges yields 2 interior faces", args: {v: 4,e: 5}, expect: 2},
       {name: "5 vertices and 7 edges yields 3 interior faces", args: {v: 5,e: 7}, expect: 3},
       {name: "6 vertices and 9 edges yields 4 interior faces", args: {v: 6,e: 9}, expect: 4}
       ];

    testCases.forEach(function(testCase) {
        it (testCase.name, function () {
            let result = eulersFaceCountCheck(testCase.args.v,testCase.args.e);
            expect(result).to.equal(testCase.expect);
        })
    })
});

