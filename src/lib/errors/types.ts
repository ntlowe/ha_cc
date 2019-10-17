export class DeserializeError extends Error {
    message: string;

    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DeserializeError.prototype);

        this.message = m;
    }
}

export class InstantiationError extends Error {
    message: string;

    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InstantiationError.prototype);

        this.message = m;
    }
}

export class ClassificationError extends Error {
    message: string;

    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ClassificationError.prototype);

        this.message = m;
    }
}