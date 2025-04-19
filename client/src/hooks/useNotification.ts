import { App } from "antd"

type ToastType = "success" | "error" | "info" | "warning"

export const useNotification = () => {
    const { message, notification } = App.useApp()

    const notify = (type: ToastType, content: string, duration = 3) => {
        message.open({ type, content, duration })
    }

    const notifyDetailed = (
        type: ToastType,
        title: string,
        description: string,
        duration = 4,
        placement:
            | "topRight"
            | "topLeft"
            | "bottomRight"
            | "bottomLeft" = "topRight"
    ) => {
        notification.open({
            type,
            message: title,
            description,
            duration,
            placement,
        })
    }

    return {
        success: (msg: string, duration?: number) =>
            notify("success", msg, duration),
        error: (msg: string, duration?: number) =>
            notify("error", msg, duration),
        info: (msg: string, duration?: number) => notify("info", msg, duration),
        warning: (msg: string, duration?: number) =>
            notify("warning", msg, duration),
        notifyDetailed,
    }
}
