import { create } from "zustand"

export interface SignUpStore {
    isSignedUp: boolean
    email: string
    name: string
    otp: string
    setSignedUp: (isSignedUp: boolean) => void
    setOtp: (otp: string) => void
    setEmail: (email: string) => void
    setName: (name: string) => void
    clear: () => void
}

const useSignUpStore = create<SignUpStore>((set) => ({
    isSignedUp: false,
    email: "",
    name: "",
    otp: "",
    setSignedUp: (isSignedUp: boolean) => set({ isSignedUp }),
    setOtp: (otp) => set({ otp }),
    setEmail: (email) => set({ email }),
    setName: (name) => set({ name }),
    clear: () => set({ email: "", name: "", otp: "" }),
}))

export default useSignUpStore
