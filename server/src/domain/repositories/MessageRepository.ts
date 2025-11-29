import { Message } from "../entities/Message";
import { MessageModel } from "../../infrastructure/db/models/MessageModel";

export class MessageRepository {
  async create(message: Message): Promise<Message> {
    const doc = await MessageModel.create({
      senderId: message.senderId,
      encryptedContent: message.encryptedContent,
      createdAt: message.createdAt
    });

    return new Message({
      id: doc._id.toString(),
      senderId: doc.senderId,
      encryptedContent: doc.encryptedContent,
      createdAt: doc.createdAt
    });
  }

  async findAll(limit = 50): Promise<Message[]> {
    const docs = await MessageModel.find({})
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
      const ordered = docs.reverse();

      return ordered.map(
        (doc) =>
          new Message({
            id: doc._id.toString(),
            senderId: doc.senderId,
            encryptedContent: doc.encryptedContent,
            createdAt: doc.createdAt,
          })
      );
  }
}
