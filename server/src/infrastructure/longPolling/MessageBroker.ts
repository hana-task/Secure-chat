import { Message } from "../../domain/entities/Message";

type Subscriber = (messages: Message[]) => void;

class MessageBroker {
  private subscribers: Subscriber[] = [];
  private pending: Message[] = [];

  subscribe(cb: Subscriber): () => void {
    // If there are messages pending before subscribe, deliver immediately
    if (this.pending.length > 0) {
      const msgs = [...this.pending];
      this.pending = [];
      cb(msgs);
      return () => {};
    }

    this.subscribers.push(cb);

    return () => {
      this.subscribers = this.subscribers.filter((fn) => fn !== cb);
    };
  }

  publish(message: Message) {
    if (this.subscribers.length === 0) {
      // Store message if no active subscribers
      this.pending.push(message);
      return;
    }

    const list = [message];
    this.subscribers.forEach((cb) => cb(list));
    this.subscribers = [];
  }
}

export default new MessageBroker();
