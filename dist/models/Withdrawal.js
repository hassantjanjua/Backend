"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const mongoose_1 = require("mongoose");
const withdrawalSchema = new mongoose_1.Schema({
    transaction: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    },
    account: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        index: true,
    },
    method: { type: String, enum: ["atm", "branch"], default: "atm" },
    location: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.Withdrawal = (0, mongoose_1.model)("Withdrawal", withdrawalSchema);
