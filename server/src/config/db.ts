import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (err :any) {
    logger.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};
