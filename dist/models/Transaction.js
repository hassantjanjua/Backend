"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    account: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdraw", "transfer_in", "transfer_out", "payment"],
        required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    referenceId: { type: String, required: true, unique: true },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
