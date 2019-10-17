import 'mocha';
import {expect} from "chai";
import {Edge} from "./edge";
import {Polygon} from "./polygon";
import {Vertex} from "./vertex";
import {Face} from "./face";

describe("polygon",function () {
    describe("area", function () {

        let test = new Polygon( [
            new Vertex(0,0),
            new Vertex(1,0),
            new Vertex(1,1),
            new Vertex(0,1)
        ],new Face(
            [0,1,2,3,0]
        ));

        let testCases = [
            {
                name: "square", args:{
                    polygon: new Polygon( [
                        new Vertex(0,0),
                        new Vertex(1,0),
                        new Vertex(1,1),
                        new Vertex(0,1)
                    ],new Face(
                        [0,1,2,3,0]
                    ))} , expected: {area: 1}
            },
            {
                name: "triangle", args:{
                    polygon: new Polygon( [
                        new Vertex(0,0),
                        new Vertex(1,0),
                        new Vertex(0,1)
                    ],new Face(
                        [0,1,2,0]
                    ))} , expected: {area: .5}
            },
            {
                name: "negative triangle", args:{
                    polygon: new Polygon( [
                        new Vertex(0,0),
                        new Vertex(-1,0),
                        new Vertex(0,-1),
                    ],new Face(
                        [0,1,2,0]
                    ))} , expected: {area: .5}
            },
            {
                name: "rectangle over y-axis with two lines on bottom border", args:{
                    polygon: new Polygon( [
                        new Vertex(0,0),
                        new Vertex(1,0),
                        new Vertex(1,10),
                        new Vertex(-1,10),
                        new Vertex(-1,0),
                        new Vertex(0,0),
                    ],new Face(
                        [0,1,2,3,4,5,0]
                    ))} , expected: {area: 20}
            },
        ];

        testCases.forEach(function (testCase) {
            it(testCase.name, function () {
                expect(testCase.args.polygon.area()).to.equal(testCase.expected.area);
            })
        })
    })
})