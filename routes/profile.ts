import { Router } from "express";
import {
    changePassword,
    updateProfile,
    updateSecuritySettings,
} from "../controllers/profileController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validator";

const router = Router();

router.use(requireAuth);

router.patch("/", asyncHandler(updateProfile));
router.patch("/security", asyncHandler(updateSecuritySettings));

router.post(
  "/change-password",
  validateBody({
    currentPassword: { required: true, type: "string" },
    newPassword: { required: true, type: "string", minLength: 8 },
  }),
  asyncHandler(changePassword),
);

export default router;
