import express from 'express'
import { checkClientOwnership, checkToken } from '../middleware/agent.auth.js'
import { addPolicy, editPolicy, getPolicy, policyMoreInfo, searchPolicy } from '../controller/policy.controller.js' 

const policy_router = express.Router()

policy_router.post('/add-policy/:clientId', checkToken, checkClientOwnership, addPolicy)

policy_router.get('/:clientId', checkToken, checkClientOwnership, getPolicy)

policy_router.get("/more-info/:policyId", checkToken, policyMoreInfo)

policy_router.patch("/more-info/:policyId/edit", checkToken, editPolicy)

policy_router.get("/filter/client", checkToken, searchPolicy)

export default policy_router