import express from 'express'
import { dashboardSummery, deleteTask, getDashboardCardPolicies, pendingTask, pendingTaskResult, upcomingRemainder } from '../controller/dashboard.controller.js'
import { checkClientOwnership, checkToken } from '../middleware/agent.auth.js'

const dashboard_router = express.Router()

dashboard_router.get('/summery', checkToken, dashboardSummery)

dashboard_router.get('/upcoming-remainder', checkToken, upcomingRemainder)

dashboard_router.get('/cardPolicies', checkToken, getDashboardCardPolicies)

dashboard_router.get('/pending-task', checkToken, pendingTask)

dashboard_router.get('/pending-task-result/:id/:jobId', checkToken, pendingTaskResult)

dashboard_router.delete('/pending-task/:jobId', checkToken, deleteTask)

export default dashboard_router