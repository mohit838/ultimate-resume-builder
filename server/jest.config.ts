import type { Config } from "jest"

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.spec.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "src/config/dbConfig.ts",
        "src/config/redisClient.ts",
        "src/logger/",
        "src/utils/appRateLimiter.ts",
    ],
}

export default config
