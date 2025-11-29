import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import healthRoutes from "./api/routes/health.routes";
import authRoutes from "./api/routes/auth.routes";
import messageRoutes from "./api/routes/message.routes";
import { logger } from "./config/logger";
import dotenv from "dotenv";


dotenv.config();
config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl
      },
      "Incoming HTTP request"
    );
    next();
  });
  
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


export default app;
