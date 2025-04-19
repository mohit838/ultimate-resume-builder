import axios from "axios"

export const handleAxiosError = (
    err: unknown,
    error: (msg: string) => void
) => {
    if (axios.isAxiosError(err)) {
        const msg =
            err.response?.data?.message || err.message || "Something went wrong"
        error(msg)
    } else {
        error("Unexpected error")
    }
}
