import type { ThemeConfig } from "antd/es/config-provider/context"

const theme: ThemeConfig = {
    token: {
        colorPrimary: "#1677ff",
        borderRadius: 8,
        colorBgLayout: "#f5f5f5",
        fontFamily: "Inter, sans-serif",
    },
    components: {
        Layout: {
            headerBg: "#ffffff",
        },
        Menu: {
            itemSelectedColor: "#1677ff",
        },
    },
}

export default theme
