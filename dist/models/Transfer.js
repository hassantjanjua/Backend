"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
const mongoose_1 = require("mongoose");
const transferSchema = new mongoose_1.Schema({
    fromAccount: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        index: true,
    },
    toAccount: { type: mongoose_1.Schema.Types.ObjectId, ref: "Account" },
    recipientName: { type: String, required: true },
    recipientBankLabel: { type: String },
    outgoingTransaction: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    },
    incomingTransaction: { type: mongoose_1.Schema.Types.ObjectId, ref: "Transaction" },
    amount: { type: Number, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.Transfer = (0, mongoose_1.model)("Transfer", transferSchema);
