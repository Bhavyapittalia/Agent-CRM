import "dotenv/config";

const stringNarrow = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

const numberNarrow = (name: string): number => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`missing envrionment variable: ${name}`)
  }

  console.log("before number value is: ", value)
  const newValue = Number(value)
  console.log("this is the number now: ", newValue)

  return newValue
}

export const ALLENVS = {
  mongoURI: stringNarrow("MONGO_URI"),
  port: numberNarrow("PORT"),
  accessSecret: stringNarrow("JWT_SECRET"),
  refreshSecret: stringNarrow("JWT_REFRESH_SECRET"),
  accessExpiry: stringNarrow("ACCESS_TOKEN_EXPIRY_TIME"),
  refreshExpiry: stringNarrow("REFRESH_TOKEN_EXPIRY_TIME"),
  fileUploadPath: stringNarrow("FILE_UPLOAD_PATH"),
  relativePath: stringNarrow("RELATIVE_PATH")
};