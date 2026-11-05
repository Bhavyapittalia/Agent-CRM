// write now in the checkToken middlware there is one our own Custome property
// which is "req.agent = decoded" which we used throughout to identityfy the correct agent

// here we are basically telling the TS that 
// you already have an Express Request interface. I am adding some properties to it
// this is called "declaration merging"



import type { JwtPayload } from 'jsonwebtoken';
import type { Client } from '../models/client.js'

declare global {
    namespace Express {
        interface Request {
            agent: {
                agentId: string
            };
            clientId?: Client;
        }
    }
}

export {}