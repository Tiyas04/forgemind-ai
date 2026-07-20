import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { askQuestion, askQuestionStream } from "../controllers/chatController.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", askQuestion);
router.post("/stream", askQuestionStream);

export default router;
