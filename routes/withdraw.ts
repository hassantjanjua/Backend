import { Router } from "express";
import { createWithdrawal } from "../controllers/withdrawController";
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
  asyncHandler(createWithdrawal),
);

export default router;
