import dotenv from "dotenv"
import { URL } from "url"

dotenv.config()

function getEnvVar(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Environment variable ${name} is not defined`)
    }
    return value
}

// Allowed Origins
export const ALLOWED_ORIGINS = getEnvVar("ALLOWED_ORIGINS").split(",")

// Parse MySQL URL
const mysqlUrl = new URL(getEnvVar("DATABASE_URL"))

// URL-based configurations
export const DB_CONFIG = {
    mysqlHost: mysqlUrl.hostname,
    mysqlUser: mysqlUrl.username,
    mysqlPassword: mysqlUrl.password,
    mysqlDatabase: mysqlUrl.pathname.replace("/", ""),
    mysqlPort: parseInt(mysqlUrl.port) || 12345,
    mongoUrl: getEnvVar("MONGO_URL"),
    redisUrl: getEnvVar("REDIS_URL"),
}

export const SERVICE_CONFIG = {
    port: getEnvVar("SERVICE_PORT"),
    name: getEnvVar("SERVICE_NAME"),
    environment: getEnvVar("NODE_ENV"),
}

export const SERVICE_SECURITIES = {
    access_token_secret: getEnvVar("ACCESS_TOKEN_SECRET"),
    refresh_token_secret: getEnvVar("REFRESH_TOKEN_SECRET"),
    jwt_secret: getEnvVar("JWT_SECRET"),
}

export const EMAIL_SERVICE = {
    otp_name: getEnvVar("OTP_NAME"),
    email_user: getEnvVar("EMAIL_USER"),
    email_pass: getEnvVar("EMAIL_PASS"),
}
