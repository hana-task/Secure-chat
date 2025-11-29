import { Schema, model, Document } from "mongoose";

export interface IMessageDocument extends Document {
  senderId: string;
  encryptedContent: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>({
  senderId: { type: String, required: true },
  encryptedContent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const MessageModel = model<IMessageDocument>("Message", MessageSchema);
