"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawController_1 = require("../controllers/withdrawController");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.post("/", (0, validator_1.validateBody)({
    accountId: { required: true, type: "string" },
    amount: { required: true, type: "number" },
}), (0, errorHandler_1.asyncHandler)(withdrawController_1.createWithdrawal));
exports.default = router;
