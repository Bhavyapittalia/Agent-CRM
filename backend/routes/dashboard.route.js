import express from 'express'
import { dashboardSummery, getDashboardCardPolicies, upcomingRemainder } from '../controller/dashboard.controller.js'
import { checkClientOwnership, checkToken } from '../middleware/agent.auth.js'

const dashboard_router = express.Router()

dashboard_router.get('/summery', checkToken, dashboardSummery)

dashboard_router.get('/upcoming-remainder', checkToken, upcomingRemainder)

dashboard_router.get('/cardPolicies', checkToken, getDashboardCardPolicies)

export default dashboard_router