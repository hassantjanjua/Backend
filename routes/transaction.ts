import { Router } from "express";
import {
    createPayment,
    getTransaction,
    listTransactions,
} from "../controllers/transactionController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validator";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listTransactions));

router.post(
  "/payment",
  validateBody({
    accountId: { required: true, type: "string" },
    amount: { required: true, type: "number" },
    merchantName: { required: true, type: "string" },
  }),
  asyncHandler(createPayment),
);

router.get("/:id", asyncHandler(getTransaction));

export default router;
