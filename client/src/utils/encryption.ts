import CryptoJS from "crypto-js";

const AES_KEY = import.meta.env.VITE_AES_KEY || "12345678901234567890123456789012";

export function encryptMessage(text: string): string {
  return CryptoJS.AES.encrypt(text, AES_KEY).toString();
}

export function decryptMessage(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, AES_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted || decrypted.trim() === '') {
      return encryptedText;
    }
    
    return decrypted;
  } catch (err) {
    return encryptedText;
  }
}