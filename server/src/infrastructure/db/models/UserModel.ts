import { Schema, model, Document } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = model<IUserDocument>("User", UserSchema);
