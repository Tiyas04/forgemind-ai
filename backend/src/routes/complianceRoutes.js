import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getComplianceAlerts, generateLLMComplianceReport, generateReport } from "../controllers/complianceController.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getComplianceAlerts);
router.post("/generate-llm-report", generateLLMComplianceReport);
router.post("/report", generateReport);

export default router;
