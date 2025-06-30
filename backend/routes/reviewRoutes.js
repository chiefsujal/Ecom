import express from "express";
import { addReview, getReviewsByProduct } from "../controllers/reviewController.js";

const router = express.Router();
router.get("/:productId", getReviewsByProduct);

export default router;
