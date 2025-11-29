import { EncryptionService } from "../src/domain/services/EncryptionService";

describe("Encryption Service", () => {
  it("encrypts and decrypts correctly", () => {
    process.env.AES_SECRET = "12345678901234567890123456789012";

    const enc = new EncryptionService();
    const text = "Hello World";
    const encrypted = enc.encrypt(text);
    const decrypted = enc.decrypt(encrypted);

    expect(decrypted).toBe(text);
  });
});
