import { endpoints } from "@/services/endpoints"
import useAuthStore, { User } from "@/stores/useAuthStore"
import axios, { AxiosResponse } from "axios"

const baseURL = `${import.meta.env.VITE_API_URL}` + "/api/"

const api = axios.create({
    baseURL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

type RefreshResponse = {
    model: {
        accessToken: string
        refreshToken: string
        user: User
    }
}

let isRefreshing = false
let refreshPromise: Promise<AxiosResponse<RefreshResponse>>

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem("refresh_token")
            const expiredAccessToken = useAuthStore.getState().token

            if (!refreshToken) {
                useAuthStore.getState().logout()
                window.location.href = "/login"
                return Promise.reject(error)
            }

            if (!isRefreshing) {
                isRefreshing = true
                refreshPromise = axios
                    .post<RefreshResponse>(
                        `${baseURL + endpoints.auth.refreshToken}`,
                        {},
                        {
                            headers: {
                                "x-refresh-token": refreshToken,
                                Authorization: `Bearer ${expiredAccessToken}`,
                            },
                            withCredentials: true,
                        }
                    )
                    .finally(() => {
                        isRefreshing = false
                    })
            }

            try {
                const { data } = await refreshPromise
                useAuthStore
                    .getState()
                    .login(data.model.accessToken, data.model.user)
                localStorage.setItem("refresh_token", data.model.refreshToken)

                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.Authorization = `Bearer ${data.model.accessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem("refresh_token")
                useAuthStore.getState().logout()
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
