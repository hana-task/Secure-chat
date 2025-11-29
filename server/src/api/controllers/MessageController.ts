import { Request, Response } from "express";
import { MessageService } from "../../domain/services/MessageService";
import MessageBroker from "../../infrastructure/longPolling/MessageBroker";
import { logger } from "../../config/logger";

export class MessageController {
  static async send(req: Request, res: Response) {
    const { text, senderId } = req.body;

    if (!text || !senderId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const service = new MessageService();
    const message = await service.createMessage(senderId, text);

    // Broadcast (long-poll)
    MessageBroker.publish(message);

    const dto = await service.toDTO(message);
    return res.status(201).json(dto);
  }

  static async recent(req: Request, res: Response) {
    try {
      const service = new MessageService();
      const messages = await service.getRecentMessages(50);
      const dtoList = await service.toDTOList(messages);
      return res.json(dtoList);
    } catch (err) {
      return res.status(500).json({ error: "Failed to load messages" });
    }
  }

  static subscribe(req: Request, res: Response) {
    const service = new MessageService();
    let finished = false;

    // Log start of long-poll subscription
    logger.info("Long polling: subscribe started");

    const unsubscribe = MessageBroker.subscribe(async (messages) => {
      if (finished) return;
      finished = true;

      // Log new message delivery
      logger.info({ count: messages.length }, "Long polling: delivering new messages");

      try {
        const dto = await service.toDTOList(messages);
        res.json(dto);
      } catch {
        logger.error("Long polling: error delivering message");
        res.status(500).json({ error: "Failed" });
      }

      unsubscribe();
      clearTimeout(timeoutId);
    });

    // Timeout fallback (return empty result)
    const timeoutId = setTimeout(() => {
      if (finished) return;
      finished = true;

      logger.info("Long polling: timeout reached, sending empty response");
      unsubscribe();
      res.json([]);
    }, 50000);

    // Handle client disconnect
    req.on("close", () => {
      if (finished) return;
      finished = true;

      logger.info("Long polling: client closed connection");
      unsubscribe();
      clearTimeout(timeoutId);
    });
  }
}
