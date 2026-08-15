import express from 'express'
import { checkClientOwnership, checkToken } from '../middleware/agent.auth.js'
import { addClient, getClientById, getClients, getUpcomingPremium, pinnedClient, searchClient, updateClient } from '../controller/client.controller.js'

const client_router = express.Router()

client_router.post('/add-client', checkToken, addClient)

client_router.get('/', checkToken, getClients)

client_router.put('/:clientId/edit-client', checkToken,checkClientOwnership, updateClient)

client_router.get('/search', checkToken, searchClient)

client_router.get('/upcoming-premium', checkToken, getUpcomingPremium)

client_router.get('/:clientId', checkToken, getClientById)

client_router.put('/:clientId/pin', checkToken, pinnedClient)


export default client_router