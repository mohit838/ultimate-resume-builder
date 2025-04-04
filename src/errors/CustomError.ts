export class CustomError extends Error {
    status: number

    constructor(message: string, status: number = 500) {
        super(message)
        this.name = this.constructor.name
        this.status = status

        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, new.target.prototype)
        }
    }
}

export function throwCustomError(message: string, status: number = 500): never {
    throw new CustomError(message, status)
}
