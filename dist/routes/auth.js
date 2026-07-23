"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
router.post("/register", (0, validator_1.validateBody)({
    fullName: { required: true, type: "string", minLength: 2 },
    email: { required: true, type: "string" },
    password: { required: true, type: "string", minLength: 8 },
}), (0, errorHandler_1.asyncHandler)(authController_1.register));
router.post("/verify-otp", (0, validator_1.validateBody)({
    userId: { required: true, type: "string" },
    code: { required: true, type: "string", minLength: 6 },
}), (0, errorHandler_1.asyncHandler)(authController_1.verifyRegistrationOTP));
router.post("/login", (0, validator_1.validateBody)({
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
}), (0, errorHandler_1.asyncHandler)(authController_1.login));
router.get("/me", auth_1.requireAuth, (0, errorHandler_1.asyncHandler)(authController_1.getMe));
router.post("/forgot-password", (0, validator_1.validateBody)({ email: { required: true, type: "string" } }), (0, errorHandler_1.asyncHandler)(authController_1.forgotPassword));
router.post("/reset-password", (0, validator_1.validateBody)({
    email: { required: true, type: "string" },
    code: { required: true, type: "string", minLength: 6 },
    newPassword: { required: true, type: "string", minLength: 8 },
}), (0, errorHandler_1.asyncHandler)(authController_1.resetPassword));
exports.default = router;
