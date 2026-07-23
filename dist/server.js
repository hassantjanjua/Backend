"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const start = async () => {
    await (0, db_1.connectDB)();
    app_1.app.listen(env_1.env.port, () => {
        logger_1.logger.info(`Server running on http://localhost:${env_1.env.port} (${env_1.env.nodeEnv})`);
    });
};
start().catch((error) => {
    logger_1.logger.error("Failed to start server", { error });
    process.exit(1);
});
