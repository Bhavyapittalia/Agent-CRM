import express from 'express'
import { registerAgent, loginAgent, refreshAccessToken} from '../controller/agent.controller.js'
import { checkToken } from '../middleware/agent.auth.js';

const agent_router = express.Router();

agent_router.post('/', registerAgent)

agent_router.post('/login', loginAgent)

agent_router.post('/refresh', refreshAccessToken)

export default agent_router