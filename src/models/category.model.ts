export interface Category {
    id: number
    name: string
    description: string | null
}

export interface CategoryCreateInput {
    name: string
    description?: string
}
