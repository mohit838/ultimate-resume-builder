class CustomError extends Error {
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

/**
 * Helper function to throw a CustomError
 * @param message - Error message
 * @param status - HTTP status code (default: 500)
 */
export function throwCustomError(message: string, status: number = 500): never {
    throw new CustomError(message, status)
}

export { CustomError }
