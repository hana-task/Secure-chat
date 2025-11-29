import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

export class AuthService {
  private userRepository: UserRepository;
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.userRepository = new UserRepository();
    
    // Load RSA keys
    const privateKeyPath = path.resolve(__dirname, "../../../keys/private.key");
    const publicKeyPath = path.resolve(__dirname, "../../../keys/public.key");
    
    this.privateKey = fs.readFileSync(privateKeyPath, "utf8");
    this.publicKey = fs.readFileSync(publicKeyPath, "utf8");
  }

  async register(username: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByUsername(username);
    if (existing) {
      throw new Error("Username already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: "", // id will be assigned by Mongo
      username,
      passwordHash
    });

    const saved = await this.userRepository.create(newUser);
    return saved;
  }

  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const existing = await this.userRepository.findByUsername(username);
    if (!existing) {
      throw new Error("Invalid username or password");
    }

    const validPassword = await bcrypt.compare(password, existing.passwordHash);
    if (!validPassword) {
      throw new Error("Invalid username or password");
    }

    // Sign with RSA private key
    const token = jwt.sign(
      { userId: existing.id, username: existing.username },
      this.privateKey,
      { algorithm: "RS256", expiresIn: "7d" }
    );

    return { token, user: existing };
  }

  // Method to verify tokens (used by middleware)
  verifyToken(token: string): any {
    return jwt.verify(token, this.publicKey, { algorithms: ["RS256"] });
  }
}