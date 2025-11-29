import { Router } from "express";
import { MessageController } from "../controllers/MessageController";

const router = Router();

router.post("/send", MessageController.send);
router.get("/subscribe", MessageController.subscribe);
router.get("/recent", MessageController.recent);


export default router;
