import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
})


// this is the "request" interceptor
// which will run before every API request going from frontend to backend
// and it will also attach the access Token with it on every request
api.interceptors.request.use(

    (config) => {
        // console.log("request interceptore is runningggg.....")
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

        if (error.response.status == 404) {
            // console.log("API request is sent")
            const response = await api.post("/agent/refresh", { refreshToken: refreshToken })
            // console.log("API request is over and the ACCESS token is generated")
            const newAccessToken = response.data.accessToken
            localStorage.setItem("accessToken", newAccessToken)

            // now passing the new token into the request after the old access token is expired
            // console.log("error.config is: ", error.config)
            const passingNewToken = error.config
            passingNewToken.headers.Authorization = newAccessToken
            // console.log("new toke is: ", passingNewToken)

            return api(passingNewToken)
        }
        return Promise.reject(error)
    }
)

export default api