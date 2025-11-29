import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../domain/entities/User";
import { Message } from "../domain/entities/Message";

import { UserRepository } from "../domain/repositories/UserRepository";
import { MessageRepository } from "../domain/repositories/MessageRepository";

import { UserModel } from "../infrastructure/db/models/UserModel";
import { MessageModel } from "../infrastructure/db/models/MessageModel";

import { EncryptionService } from "../domain/services/EncryptionService";

const userRepo = new UserRepository();
const messageRepo = new MessageRepository();
const encryption = new EncryptionService();

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    console.log("Clearing existing users and messages...");
    await UserModel.deleteMany({});
    await MessageModel.deleteMany({});

    console.log("Creating users...");

    const passwordHash = await bcrypt.hash("password123", 10);

    const aliceEntity = new User({
      id: "",
      username: "alice",
      passwordHash,
      createdAt: new Date(),
    });

    const bobEntity = new User({
      id: "",
      username: "bob",
      passwordHash,
      createdAt: new Date(),
    });

    const alice = await userRepo.create(aliceEntity);
    const bob = await userRepo.create(bobEntity);

    console.log("Users created:", { alice: alice.username, bob: bob.username });

    console.log("Creating demo messages...");

    const demoTexts = [
      "Hello world!",
      "Welcome to Secure Chat",
      "This is encrypted",
      "Nice to meet you",
      "Testing message history",
    ];

    for (let i = 0; i < demoTexts.length; i++) {
      const text = demoTexts[i];
      const encrypted = encryption.encrypt(text);
    
      const msgEntity = new Message({
        id: "",
        senderId: alice.id,
        encryptedContent: encrypted,
        createdAt: new Date(Date.now() + i),
      });
    
      await messageRepo.create(msgEntity);
    }
    

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
