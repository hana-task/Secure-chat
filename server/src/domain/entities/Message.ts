export class Message {
    public id: string;
    public senderId: string;
    public encryptedContent: string;
    public createdAt: Date;
  
    constructor(params: {
      id: string;
      senderId: string;
      encryptedContent: string;
      createdAt?: Date;
    }) {
      this.id = params.id;
      this.senderId = params.senderId;
      this.encryptedContent = params.encryptedContent;
      this.createdAt = params.createdAt || new Date();
    }
  }
  