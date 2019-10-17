import {Line} from "../geo/primitives/line";
import {BoundingBox} from "../geo/primitives/boundingbox";
import {ClassificationError, DeserializeError, InstantiationError} from "../errors/types";
import {DomIds, DrawingElements, getBoundingBox, ViewProps} from "./viewprops";
import {Polygon} from "../geo/primitives/polygon";

const svgNamespace = "http://www.w3.org/2000/svg";

// this would normally be the domain of a framework (e.g. vue, react, etc.)
//   it wires up the view to the library/algorithms
export class View {
    private readonly _props: ViewProps;
    private readonly _domIds: DomIds;
    private _svg: SVGSVGElement;

    constructor(vm: ViewProps, domIds: DomIds) {
        this._props = vm;
        this._domIds = domIds;

        this.setDefaultText();
    }

    public listenForChanges = () => {
        this.listenForButtonClick();
    };

    private setDefaultText = () => {
        (<HTMLInputElement>document.getElementById(this._domIds.jsonInputId)).value = this._props.defaultText;
    };

    private listenForButtonClick = () => {

        const b = document.getElementById(this._domIds.buttonId);
        b.onclick = () => {

            this.regenerateView();

            let multilineTextRaw = (<HTMLInputElement>document.getElementById(this._domIds.jsonInputId)).value;
            let json = multilineTextRaw.trim();

            let elements = this._props.jsonToDrawingElements(json);

            if (elements.error != null) {
                switch (elements.error.constructor) {
                    case DeserializeError:{}
                        this.showError((<DeserializeError>elements.error).message);
                    break;
                    case InstantiationError:{}
                        this.showError((<InstantiationError>elements.error).message);
                        break;
                    case ClassificationError:{}
                        this.showError((<ClassificationError>elements.error).message);
                        break;
                    default:
                        this.showError("could not deserialize json");
                }
                return
            }
            this.draw(elements);
        }
    };

    private regenerateView = () => {

        //erase previous svg dom element, if present
        let oldSvg = document.getElementById(this._domIds.domSvgId);
        if (oldSvg != null) {
            oldSvg.remove();
        }

        // create svg dom element
        let svg = document.createElementNS(svgNamespace,"svg");
        svg.setAttribute("id", this._domIds.domSvgId);

        // append svg to existing container dom element
        let mainRow = document.getElementById(this._domIds.mainContentRowId);
        mainRow.appendChild(svg);

        // clear error text
        let errorLabel = (<HTMLInputElement>document.getElementById(this._domIds.jsonErrLabel));
        errorLabel.textContent = "";

        // set internal svg to new svg object
        this._svg = svg;
    };

    private draw = (drawingElements: DrawingElements) => {
        let lines = drawingElements.lines;
        let vertices = drawingElements.vertices;
        let polygons = drawingElements.polygons;

        let scaledBuffer = this.createScaledCanvas(vertices);
        let polygonElements = createSvgPolygons(polygons, scaledBuffer);
        let pathElements = createSvgPaths(lines, scaledBuffer);

        for (let element of polygonElements) {
            this._svg.append(element)
        }

        for (let element of pathElements) {
            this._svg.append(element)
        }
    };

    private createScaledCanvas = (vertices) => {
        let bb = getBoundingBox(vertices);

        let viewWidth = this._props.viewWidth;
        let viewHeight = this._props.viewHeight;

        let widthConstant = viewWidth / (bb.max.x - bb.min.x);
        let heightConstant = viewHeight / (bb.max.y - bb.min.y);
        let minConstant = Math.min(widthConstant, heightConstant);

        let viewMargin = this._props.viewMargin; //in pixels

        let scaledBuffer = viewMargin / minConstant;

        this._svg.setAttribute("width", viewWidth.toString());
        this._svg.setAttribute("height", viewHeight.toString());
        this._svg.setAttribute("viewBox", getSvgViewBox(bb, scaledBuffer * 2));
        return scaledBuffer;
    };

    private showError(msg: string) {
        let errorLabel = (<HTMLInputElement>document.getElementById("error-label"));
        errorLabel.textContent = msg;
    }
}

export function createSvgPaths(lines: Line[], translate: number): SVGPathElement[] {
    return lines.map((line: Line)=> {

        // create svg geometry
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');

        //set geometry
        newElement.setAttribute("d",
            `M ${line.startVertex.x} ${line.startVertex.y} L ${line.endVertex.x} ${line.endVertex.y}`);

        //translate to center in adjusted-border
        newElement.setAttribute("transform", `translate(${translate} ${translate})`);
        return newElement;
    });
}

export function createSvgPolygons(polygons: Polygon[], translate: number): SVGPolygonElement[] {
    return polygons.map((polygon: Polygon)=> {

        // create svg geometry
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');

        //set geometry
        newElement.setAttribute("points", createPolygonSvgString(polygon));

        // set randomized color
        let randomColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        newElement.setAttribute("fill", randomColor);

        //translate to center in adjusted-border
        newElement.setAttribute("transform", `translate(${translate} ${translate})`);
        return newElement;
    });
}

export function createPolygonSvgString(polygon: Polygon): string {
    let str = "";
    for (let vertex of polygon.vertices) {
        str += `${vertex.x},${vertex.y} `;
    }
    str.trim();
    return str;
}


export function getSvgViewBox(bb: BoundingBox, buffer: number): string {
    if (bb.min == null || bb.max == null) {
        throw new Error("null bounding boxes cannot be converted to svg");
    }

    let width = bb.max.x - bb.min.x;
    let height = bb.max.y - bb.min.y;

    return `${bb.min.x} ${bb.min.y} ${width +  buffer} ${height + buffer}`;
}