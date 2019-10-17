import 'mocha';
import {expect} from "chai";
import {Edge, getInverse} from "./edge";

describe("primitives.edge",function ()  {
    describe("instantiation", function () {

        let testCases = [
            {name:"proper positive integers should instantiate without error with a proper hash",
                args: {start:1, end:2}, expected: {error: false}},
            {name:"proper integers zero and above should instantiate without error with a proper hash",
                args: {start:0, end:2}, expected: {error: false}},
            {name:"proper integers, including larger values, should instantiate without error with a proper hash",
                args: {start:30000, end:20000}, expected: {error: false}},
            {name:"decimal start indexes should throw an error",
                args: {start:4.4, end:5}, expected: {error: true}},
            {name:"decimal end indexes should throw an error",
                args: {start:400, end:500.5}, expected: {error: true}},
            {name:"decimal start and end indexes should throw an error",
                args: {start:4.4, end:5}, expected: {error: true}},
            {name:"negative start index should throw an error",
                args: {start:-4, end:5}, expected: {error: true}},
            {name:"negative end index should throw an error",
                args: {start:4, end:-5}, expected: {error: true}},
            {name:"negative start and end indexes should throw an error",
                args: {start:-4, end:-5}, expected: {error: true}}
        ];

        testCases.forEach(function(testCase) {
            it (testCase.name, function () {
                if (testCase.expected.error){
                    expect(()=>  new Edge(testCase.args.start,testCase.args.end)).to.throw(Error);
                } else  {
                    let edge = new Edge(testCase.args.start,testCase.args.end);
                    expect(testCase.args.start).to.equal(edge.startIndex);
                    expect(testCase.args.end).to.equal(edge.endIndex);
                }
            })
        })
    });

    describe("invert", function () {

        let testCases = [
            {name:"single digit indexes flip properly",
                args: {start:1, end:2}, expected: {start:2, end:1}},
            {name:"single and double digit numbers...",
                args: {start:0, end:10}, expected: {start:10, end:0}},
            {name:"large numbers",
                args: {start:5, end:1000}, expected: {start:1000, end:5}},
        ];

        testCases.forEach(function(testCase) {
            it (testCase.name, function () {

                let edge = getInverse(new Edge(testCase.args.start,testCase.args.end));
                expect(edge.startIndex).to.equal(testCase.expected.start);
                expect(edge.endIndex).to.equal(testCase.expected.end);
            })
        })
    })
});