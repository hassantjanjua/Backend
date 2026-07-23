import { Router } from "express";
import {
    addCard,
    listCards,
    setCardFrozen,
    updateCardSettings,
} from "../controllers/cardController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validator";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listCards));

router.post(
  "/",
  validateBody({ accountId: { required: true, type: "string" } }),
  asyncHandler(addCard),
);

router.patch(
  "/:id/freeze",
  validateBody({ frozen: { required: true, type: "boolean" } }),
  asyncHandler(setCardFrozen),
);

router.patch("/:id/settings", asyncHandler(updateCardSettings));

export default router;
