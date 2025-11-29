import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import http from "http";
import app from "../src/app";

export const setupTestServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, () => resolve()));

  const address = server.address();
  if (typeof address !== "object" || !address) {
    throw new Error("Failed to get server address");
  }

  const url = `http://127.0.0.1:${address.port}`;

  return {
    server,
    url,
    close: async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
      server.close();
    }
  };
};
