import 'mocha';
import {expect} from "chai";
import {angleBetweenVectorsCW, Vector} from "./vector";

describe("cw angle between vectors",function ()  {

    let testCases = [
        {name: "1", args: { vec1: new Vector(0,1), vec2: new Vector(0,10)}, expect: 0},
        {name: "2", args: { vec1: new Vector(0,1), vec2: new Vector(0,-2)}, expect: 180},
        {name: "3", args: { vec1: new Vector(1,0), vec2: new Vector(1,0)}, expect: 0},
        {name: "4", args: { vec1: new Vector(-10,0), vec2: new Vector(1,0)}, expect: 180},
        {name: "5", args: { vec1: new Vector(0,1), vec2: new Vector(1,1)}, expect: 45},
        {name: "6", args: { vec1: new Vector(1,1), vec2: new Vector(0,1)}, expect: 315},
        {name: "7", args: { vec1: new Vector(0,1), vec2: new Vector(0.01,-1)}, expect: 179.43},
        {name: "8", args: { vec1: new Vector(0,1), vec2: new Vector(-1,0)}, expect: 270},
        {name: "9", args: { vec1: new Vector(1,1), vec2: new Vector(-1,-1)}, expect: 180},
        {name: "10", args: { vec1: new Vector(-1,1), vec2: new Vector(1,-1)}, expect: 180},
        {name: "11", args: { vec1: new Vector(1,1), vec2: new Vector(1,1)}, expect: 0},
        {name: "12", args: { vec1: new Vector(-1,0), vec2: new Vector(-5,0)}, expect: 0},
        {name: "13", args: { vec1: new Vector(-1,0), vec2: new Vector(-1,1)}, expect: 45},
        {name: "14", args: { vec1: new Vector(-1,0), vec2: new Vector(1,-1)}, expect: 225},
        {name: "15", args: { vec1: new Vector(-1,0), vec2: new Vector(0,1)}, expect: 90},
        {name: "16", args: { vec1: new Vector(1,0), vec2: new Vector(1,-1)}, expect: 45},
    ];

    testCases.forEach(function(testCase) {
        it (testCase.name, function () {
            let result = angleBetweenVectorsCW(testCase.args.vec1,testCase.args.vec2);
            let resultDegrees = rad_to_deg(result);
            expect(resultDegrees.toFixed(2)).to.equal(testCase.expect.toFixed(2));
        })
    })
});

// radians to degrees
export function rad_to_deg(radians) {
    return radians * (180 / Math.PI);
}