import { Router } from "express";
import { createDeposit } from "../controllers/depositController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validator";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  validateBody({
    accountId: { required: true, type: "string" },
    amount: { required: true, type: "number" },
  }),
  asyncHandler(createDeposit),
);

export default router;
