declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      AES_SECRET: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
  
