import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
    getSingleEposter,
    submitEposterAssessment,
    updateEposterAssessment
} from "../controllers/eposterAssessmentController.js";

const router = express.Router();

// GET ePoster details + assessment
router.get("/:abstractNo", protect, getSingleEposter);

// CREATE assessment
router.post("/assess", protect, submitEposterAssessment);

// UPDATE assessment
router.put("/assess/:abstractNo", protect, updateEposterAssessment);

export default router;
