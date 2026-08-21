import jwt from 'jsonwebtoken'

export const jwtToken = (headers, secretKey, expireTime) => {
    const token = jwt.sign(
        {
            // will be useful when we need to assign client with agentId wise
           // here we are putting the agentId in the token PAYLOAD
            agentId: headers
        },
        secretKey,
        {
            expiresIn: expireTime
        }
    )

    return token
}