import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../domain/services/AuthService";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

const authService = new AuthService();

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};