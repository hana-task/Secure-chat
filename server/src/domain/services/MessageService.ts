import { MessageRepository } from "../repositories/MessageRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Message } from "../entities/Message";
import { EncryptionService } from "./EncryptionService";

export interface MessageDTO {
  id: string;
  senderId: string;
  username: string;
  text: string;
  createdAt: string;
}

export class MessageService {
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;
  private encryptionService: EncryptionService;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.userRepository = new UserRepository();
    this.encryptionService = new EncryptionService();
  }

  async createMessage(senderId: string, text: string): Promise<Message> {
    const encryptedContent = this.encryptionService.encrypt(text);

    const message = new Message({
      id: "",
      senderId,
      encryptedContent,
      createdAt: new Date()
    });

    return this.messageRepository.create(message);
  }

  async getRecentMessages(limit: number = 50): Promise<Message[]> {
    return this.messageRepository.findAll(limit);
  }

  decryptMessage(message: Message): string {
    return this.encryptionService.decrypt(message.encryptedContent);
  }

  async toDTO(message: Message): Promise<MessageDTO> {
    const user = await this.userRepository.findById(message.senderId);

    return {
      id: message.id,
      senderId: message.senderId,
      username: user?.username ?? "Unknown",
      text: this.decryptMessage(message),
      createdAt: message.createdAt.toISOString()
    };
  }

  async toDTOList(messages: Message[]): Promise<MessageDTO[]> {
    return Promise.all(messages.map((m) => this.toDTO(m)));
  }
}
