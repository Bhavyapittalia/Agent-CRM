import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import agent_router from './routes/agent.route.js'
import client_router from './routes/client.route.js'
import policy_router from './routes/policy.route.js'
import dashboard_router from './routes/dashboard.route.js'
import "./alert_schedule/payment.alert.js"
import cors from 'cors'
import analytics_router from './routes/dashboard.analytics.route.js'

const app = express()
const port = 3000

dotenv.config()
// a middleware which will parse the incoming request data into JSON format
app.use(express.json())

// a middlware which will help us to pass the backend data to frontend and vice-versa
app.use(cors())

// exporting all the routes here
app.use('/agent', agent_router)
app.use('/client', client_router)
app.use('/policy', policy_router)
app.use('/dashboard', dashboard_router)
app.use('/dashboard/analytics', analytics_router)

// connectiong database
connectDB()

app.get('/', (req, res) => {
  res.send('Hello World server is running!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})