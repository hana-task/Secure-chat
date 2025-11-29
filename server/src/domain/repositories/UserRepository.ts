import { User } from "../entities/User";
import { UserModel } from "../../infrastructure/db/models/UserModel";
import { Types } from "mongoose";


export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username }).exec();
    if (!doc) return null;

    return new User({
      id: doc._id.toString(),
      username: doc.username,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt
    });
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
  
    const doc = await UserModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;
  
    return new User({
      id: doc._id.toString(),
      username: doc.username,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt
    });
  }
  

  async create(user: User): Promise<User> {
    const doc = await UserModel.create({
      username: user.username,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt
    });

    return new User({
      id: doc._id.toString(),
      username: doc.username,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt
    });
  }
}
