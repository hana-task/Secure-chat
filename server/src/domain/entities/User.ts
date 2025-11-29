export class User {
    public id: string;
    public username: string;
    public passwordHash: string;
    public createdAt: Date;
  
    constructor(params: {
      id: string;
      username: string;
      passwordHash: string;
      createdAt?: Date;
    }) {
      this.id = params.id;
      this.username = params.username;
      this.passwordHash = params.passwordHash;
      this.createdAt = params.createdAt || new Date();
    }
  }
  