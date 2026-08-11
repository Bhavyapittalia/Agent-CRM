import express from 'express'
import { checkToken } from '../middleware/agent.auth.js'
import { dashboardAnalytcis } from '../controller/dashboard.analytics..controller.js'

const analytics_router = express.Router()

analytics_router.get('/', checkToken, dashboardAnalytcis)

export default analytics_router