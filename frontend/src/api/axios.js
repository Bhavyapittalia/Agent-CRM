import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
})

let isRefresh = false
let apiQueue = []


const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

// this is the "request" interceptor
// which will run before every API request going from frontend to backend
// and it will also attach the access Token with it on every request
api.interceptors.request.use(

    // axios interceptor create one config object which contains the all the information about the API
    // like : 
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
            if (isRefresh) {
                console.log("OTHER TWO API'S ARE IN QUEUE RIGHT NOW: ", error.config)
                // apiQueue.push(error.config)
                console.log("queue is: ", JSON.stringify(apiQueue))
                return new Promise((resolve, reject) => {
                    apiQueue.push({ resolve, reject })
                }).then(token => {
                    apiQueue.headers.Authorization = token

                    api(apiQueue)
                })
            }

            isRefresh = true

            try {
                console.log("Only first API came here right now!!!")
                const response = await api.post("/agent/refresh", { refreshToken: refreshToken })

                const newAccessToken = response.data.accessToken
                localStorage.setItem("accessToken", newAccessToken)

                console.log("queue is: ", apiQueue)

                while (apiQueue.length > 0) {

                    // getting all API's form the queue
                    const remainingApi = apiQueue.shift()
                    console.log("remaining api are: ", remainingApi)

                    remainingApi.headers.Authorization = newAccessToken
                    await api(remainingApi)
                }

                // processQueue(null, newAccessToken);

                // now passing token into  new config after the old access token is expired
                // error.config contains the failed API  
                const passingNewConfig = error.config;
                console.log("error.config is: ", error.config)
                passingNewConfig.headers.Authorization = newAccessToken

                isRefresh = false
                // console.log("queue contains: ", apiQueue)
                return api(passingNewConfig)
            }
            catch (error) {
                localStorage.clear()
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default api