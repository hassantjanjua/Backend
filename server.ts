import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const start = async () => {
  await connectDB();

  app.listen(env.port, () => {
    logger.info(
      `Server running on http://localhost:${env.port} (${env.nodeEnv})`,
    );
  });
};

start().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
