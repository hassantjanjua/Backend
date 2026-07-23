import { Router } from "express";
import {
    forgotPassword,
    getMe,
    login,
    register,
    resetPassword,
    verifyRegistrationOTP,
} from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validator";

const router = Router();

router.post(
  "/register",
  validateBody({
    fullName: { required: true, type: "string", minLength: 2 },
    email: { required: true, type: "string" },
    password: { required: true, type: "string", minLength: 8 },
  }),
  asyncHandler(register),
);

router.post(
  "/verify-otp",
  validateBody({
    userId: { required: true, type: "string" },
    code: { required: true, type: "string", minLength: 6 },
  }),
  asyncHandler(verifyRegistrationOTP),
);

router.post(
  "/login",
  validateBody({
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
  }),
  asyncHandler(login),
);

router.get("/me", requireAuth, asyncHandler(getMe));

router.post(
  "/forgot-password",
  validateBody({ email: { required: true, type: "string" } }),
  asyncHandler(forgotPassword),
);

router.post(
  "/reset-password",
  validateBody({
    email: { required: true, type: "string" },
    code: { required: true, type: "string", minLength: 6 },
    newPassword: { required: true, type: "string", minLength: 8 },
  }),
  asyncHandler(resetPassword),
);

export default router;
