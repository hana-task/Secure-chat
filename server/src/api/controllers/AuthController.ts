import { Request, Response } from "express";
import { AuthService } from "../../domain/services/AuthService";
import { logger } from "../../config/logger";


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const user = await this.authService.register(username, password);

      logger.info(
        { username },
        "New user registered"
      );
      

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
        }
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const { token, user } = await this.authService.login(username, password);
      
      logger.info(
        { username },
        "User logged in"
      );
      

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
        }
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };
}
