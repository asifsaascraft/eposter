import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllAbstracts } from "../controllers/abstractController.js";

const router = express.Router();

router.get("/all", protect, getAllAbstracts);

export default router;
