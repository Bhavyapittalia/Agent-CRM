import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
})

let isRefreshing = false
let apiQueue = []

const queueProcess = (error, newToken) => {

    apiQueue.forEach((apiPromise) => {
        if (error) {
            return apiPromise.reject(error)
        }
        return apiPromise.resolve(newToken)
    })

    apiQueue = []
}

// this is the "request" interceptor
// which will run before every API request going from frontend to backend
// and it will also attach the access Token with it on every request
api.interceptors.request.use(

    // axios interceptor create one config object which contains the all the information about the API
    (config) => {

        console.log("request interceptore is runningggg.....")
        const accessToken = localStorage.getItem("accessToken");

        // console.log("config is: ", config)
        if (accessToken) {
            config.headers.Authorization = accessToken
        }
        return config
    },
    (error) => {
        console.log("config error is: ", error.config)
        return Promise.reject(error)
    }
)

// this is the "response" interceptor run after every API
// which will run after every response coming from the backend to frontend on requested API
// and this will check is access token is expired or not
api.interceptors.response.use(

    // after calling API this response is passed to the "frontend" 
    (response) => {
        return response
    },

    async (error) => {
        // console.log("Error Occuriingg...", error.response)
        const refreshToken = localStorage.getItem("refreshToken")
        console.log("error response is: ", error)

        if (error.response.status == 401) {


            console.log("401")

            if (isRefreshing) {

                return new Promise((resolve, reject) => {
                    apiQueue.push({ resolve, reject })
                })
                .then((newToken) => {
                    originalRequest.headers.Authorization = newToken
                    return api(originalRequest)
                })

            }

            isRefreshing = true

            try {
                const response = await api.post("/agent/refresh", { refreshToken: refreshToken })

                const newAccessToken = response.data.accessToken
                localStorage.setItem("accessToken", newAccessToken)

                queueProcess(null, newAccessToken)

                // now passing token into  new config after the old access token is expired
                // error.config contains the failed API  
                const passingNewConfig = error.config;
                console.log("error.config is: ", error.config)
                passingNewConfig.headers.Authorization = newAccessToken

                isRefreshing = false
                // console.log("queue contains: ", apiQueue)
                return api(passingNewConfig)
            }
            catch (error) {
                queueProcess(error, null)

                isRefreshing = false
                localStorage.clear()
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default api