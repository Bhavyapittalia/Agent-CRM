import express from 'express'
import { dashboardSummery, upcomingRemainder } from '../controller/dashboard.controller.js'
import { checkToken } from '../middleware/agent.auth.js'

const dashboard_router = express.Router()

dashboard_router.get('/summery', checkToken, dashboardSummery)
dashboard_router.get('/upcoming-remainder', checkToken, upcomingRemainder)

export default dashboard_router