import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";


const authController = new AuthController();
const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", authMiddleware, (req: any, res) => {
    res.json({ user: req.user });
  });

export default router;
