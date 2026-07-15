import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  logoutUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);

export default router;