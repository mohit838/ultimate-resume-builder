export interface Category {
    id: number
    name: string
    description: string | null
}

export interface CategoryCreateInput {
    name: string
    description?: string
}

export interface FetchAllCategory {
    id: number
    name: string
    description: string | null
    created_at: Date
    updated_at: Date
}
