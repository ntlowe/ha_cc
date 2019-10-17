import {checkSafePositiveInt} from "../shared/validation";
import {InstantiationError} from "../../errors/types";

export class Face {
    private readonly _indexes: number[];

    constructor(indexes: number[]) {

        //check indexes are positive integers
        for (let index of indexes) {
            if (index == null) {
                    throw new InstantiationError("face index cannot be null")
            }
            checkSafePositiveInt(index);
        }

        this._indexes = indexes;
    }

    public get indexes():number[] {
        return this._indexes;
    }
}


