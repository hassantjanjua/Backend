import { Router } from "express";
import { getAccount, getAccounts } from "../controllers/accountController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getAccounts));
router.get("/:id", asyncHandler(getAccount));

export default router;
