import axios from "axios";
import { queueProcess, apiQueue } from "@/utils/queue.process";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

let isRefreshing = false;

// this is the "request" interceptor
// which will run before every API request going from frontend to backend
// and it will also attach the access Token with it on every request
api.interceptors.request.use(

    (config) => {
        // axios interceptor create one config object which contains the all the information about the API
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = accessToken;
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);



// this is the "response" interceptor run after every API
// which will run after every response coming from the backend to frontend on requested API
// and this will check is access token is expired or not
api.interceptors.response.use(
    (response) => response,

    async (error: unknown) => {
        // only handle 401 responses from the server, and only if we know which request failed
        if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        // the refresh call itself failed: refresh token is invalid, so log out
        if (originalRequest.url === "/agent/refresh") {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // another request is already refreshing: wait for its new token
        if (isRefreshing) {
            const newToken = await new Promise<string>((resolve, reject) => {
                apiQueue.push({ resolve, reject });
            });
            originalRequest.headers.Authorization = newToken;
            return api(originalRequest);
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem("refreshToken");

            const response = await api.post<{ accessToken: string }>("/agent/refresh", { refreshToken });

            const newAccessToken = response.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);

            queueProcess(null, newAccessToken);


            // now passing token into  new config after the old access token is expired
            // error.config contains the failed API  
            originalRequest.headers.Authorization = newAccessToken;

            return api(originalRequest);

        } 
        catch (refreshError) {
            
            queueProcess(refreshError, null);
            
            localStorage.clear();
            
            window.location.href = "/login";
            
            return Promise.reject(refreshError);
        }
        finally {
            isRefreshing = false;
        }
    }
);

export default api;