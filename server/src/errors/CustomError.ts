export class CustomError extends Error {
    statusCode: number
    errors?: any

    constructor(message: string, statusCode = 500, errors?: any) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors

        Object.setPrototypeOf(this, CustomError.prototype)
    }
}

export function throwCustomError(message: string, status: number = 500): never {
    throw new CustomError(message, status)
}
