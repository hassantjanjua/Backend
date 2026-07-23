"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", (0, errorHandler_1.asyncHandler)(transactionController_1.listTransactions));
router.post("/payment", (0, validator_1.validateBody)({
    accountId: { required: true, type: "string" },
    amount: { required: true, type: "number" },
    merchantName: { required: true, type: "string" },
}), (0, errorHandler_1.asyncHandler)(transactionController_1.createPayment));
router.get("/:id", (0, errorHandler_1.asyncHandler)(transactionController_1.getTransaction));
exports.default = router;
