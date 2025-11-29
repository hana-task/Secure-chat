import crypto from "crypto";

export class EncryptionService {
  private algorithm = "aes-256-cbc";
  private secret: string;
  private key = process.env.AES_SECRET;

  constructor() {
    if (!this.key|| this.key.length < 32) {
      throw new Error("AES_SECRET must be at least 32 characters long");
    }

    // ensure 32 bytes key
    this.secret = this.key.slice(0, 32);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secret), iv);

    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secret), iv);

    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  }
}
