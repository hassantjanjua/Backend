import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[db] Connected to MongoDB at ${env.mongoUri}`);
  } catch (error) {
    console.error("[db] Connection failed:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[db] MongoDB disconnected");
});
