import {InstantiationError} from "../../errors/types";

export function checkSafePositiveInt (num: number) {
    if(!Number.isSafeInteger(num)) throw new InstantiationError(`${num} is not an integer`);
    if (num < 0) {
        throw new InstantiationError(`${num} is less than 0, expected index`)
    }
}