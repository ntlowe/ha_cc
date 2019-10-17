import {checkSafePositiveInt} from "../shared/validation";
import {InstantiationError} from "../../errors/types";

export class Edge {
    private readonly _startIndex: number;
    private readonly _endIndex: number;

    constructor(startIndex: number, endIndex: number) {

        if (startIndex == null) {
            throw new InstantiationError(`edge start index cannot be null`);
        }
        if (endIndex == null) {
            throw new InstantiationError(`edge end index cannot be null`);
        }

       checkSafePositiveInt(startIndex);
       checkSafePositiveInt(endIndex);

       if (startIndex == endIndex) throw new InstantiationError(`zero length edges not allowed`);

        this._startIndex = startIndex;
        this._endIndex = endIndex;
    }

    public get startIndex():number {
        return this._startIndex;
    }

    public get endIndex():number {
        return this._endIndex;
    }
}

export function getInverse(edge: Edge): Edge {
    return new Edge(edge.endIndex, edge.startIndex);
}

