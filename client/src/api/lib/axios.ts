import useAuthStore from "@/stores/useAuthStore"
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem("refresh_token")

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}auth/refresh`,
                    {},
                    {
                        headers: {
                            "x-refresh-token": refreshToken,
                        },
                        withCredentials: true,
                    }
                )

                useAuthStore
                    .getState()
                    .login(data.model.accessToken, data.model.user)
                localStorage.setItem("refresh_token", data.model.refreshToken)

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.model.accessToken}`
                return api(originalRequest)
            } catch (refreshError: unknown) {
                // Check for 401 from refresh token API
                if (
                    axios.isAxiosError(refreshError) &&
                    refreshError.response?.status === 401
                ) {
                    console.warn("Refresh token invalid. Logging out...")
                    localStorage.removeItem("refresh_token")
                    useAuthStore.getState().logout()
                    window.location.href = "/login"
                }

                // Other types of error (network, unexpected)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
