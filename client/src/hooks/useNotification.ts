import { message } from "antd"

type MessageType = "success" | "error" | "info" | "warning" | "loading"

export const useNotification = () => {
    const notify = (type: MessageType, content: string) => {
        message[type](content)
    }

    return {
        success: (msg: string) => notify("success", msg),
        error: (msg: string) => notify("error", msg),
        info: (msg: string) => notify("info", msg),
        warning: (msg: string) => notify("warning", msg),
        loading: (msg: string) => notify("loading", msg),
    }
}
