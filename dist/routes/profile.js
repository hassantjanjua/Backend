"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.patch("/", (0, errorHandler_1.asyncHandler)(profileController_1.updateProfile));
router.patch("/security", (0, errorHandler_1.asyncHandler)(profileController_1.updateSecuritySettings));
router.post("/change-password", (0, validator_1.validateBody)({
    currentPassword: { required: true, type: "string" },
    newPassword: { required: true, type: "string", minLength: 8 },
}), (0, errorHandler_1.asyncHandler)(profileController_1.changePassword));
exports.default = router;
