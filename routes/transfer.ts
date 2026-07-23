import { Router } from "express";
import { createTransfer } from "../controllers/transferController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validator";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  validateBody({
    fromAccountId: { required: true, type: "string" },
    amount: { required: true, type: "number" },
    recipientName: { required: true, type: "string" },
  }),
  asyncHandler(createTransfer),
);

export default router;
