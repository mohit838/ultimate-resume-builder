import { create } from "zustand"

interface ResetPassStore {
    isResetPass: boolean
    resetEmail: string
    setResetEmail: (email: string) => void
}

const useResetPassStore = create<ResetPassStore>((set) => ({
    isResetPass: false,
    resetEmail: "",
    setResetEmail: (email: string) =>
        set({ resetEmail: email, isResetPass: true }),
}))

export default useResetPassStore
