import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
    id: string
    name: string
    email: string
    role: string
    emailVerified: boolean
    googleAuthEnabled: boolean
}

export interface AuthState {
    isAuthenticated: boolean
    token: string | null
    isLoading: boolean
    user: User | null
    login: (token: string, user: User) => void
    logout: () => void
    setLoading: (value: boolean) => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            login: (token, user) => set({ isAuthenticated: true, token, user }),
            logout: () =>
                set({ isAuthenticated: false, token: null, user: null }),
            setLoading: (value) => set({ isLoading: value }),
        }),
        {
            name: "auth-storage",
        }
    )
)

export default useAuthStore
