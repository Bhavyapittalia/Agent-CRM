// this file is made because in TS we can't directly access the env files variable
// because TS will count as a string | undefined 

export type EnvNames = "JWT_SECRET" | "ACCESS_TOKEN_EXPIRY_TIME" | "JWT_REFRESH_SECRET" | "REFRESH_TOKEN_EXPIRY_TIME";

export const getEnv = (name: EnvNames): string => {
    const value = process.env[name]

    if (!value) {
        throw new Error(`missing this variable in env file ${name}`)
    }

    return value
}

// (()=>{
//     const all_envs = ["JWT_SECRET", "ACCESS_TOKEN_EXPIRY_TIME" , "JWT_REFRESH_SECRET" , "REFRESH_TOKEN_EXPIRY_TIME"];
//     const missing_envs = all_envs.filter((env) => process.env[env] === undefined);
//     if (missing_envs.length) {
//         throw new Error('Missing Following ENVS: ' + missing_envs.join(','))
//     }
// })()