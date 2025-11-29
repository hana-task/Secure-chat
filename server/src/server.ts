import "dotenv/config";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";


const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(process.env.PORT || 4000, () => {
    logger.info(`Server running on port ${process.env.PORT}`);
  });

};

startServer();
