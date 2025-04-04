import { CustomError } from "@/errors/CustomError"

export class NotFoundError extends CustomError {
    status: number
    constructor(message: string) {
        super(message)
        this.name = "NotFoundError"
        this.status = 404
    }
}
