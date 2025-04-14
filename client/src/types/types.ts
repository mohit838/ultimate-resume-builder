import { ReactNode } from "react"

export interface RouteItem {
    path: string
    element: React.FC
    private: boolean
    menu?: {
        name: string
        parent?: string
        icon?: ReactNode
    }
}
