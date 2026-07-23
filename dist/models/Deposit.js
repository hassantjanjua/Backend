"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposit = void 0;
const mongoose_1 = require("mongoose");
const depositSchema = new mongoose_1.Schema({
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
    method: {
        type: String,
        enum: ["atm", "branch", "mobile_check"],
        default: "atm",
    },
    location: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.Deposit = (0, mongoose_1.model)("Deposit", depositSchema);
