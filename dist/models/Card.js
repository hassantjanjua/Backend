"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mongoose_1 = require("mongoose");
const cardSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    account: { type: mongoose_1.Schema.Types.ObjectId, ref: "Account", required: true },
    cardNumberLast4: { type: String, required: true },
    cardNumberEncrypted: { type: String, required: true, select: false },
    expiry: { type: String, required: true },
    type: { type: String, enum: ["physical", "virtual"], default: "physical" },
    label: { type: String },
    frozen: { type: Boolean, default: false },
    onlinePaymentsEnabled: { type: Boolean, default: true },
    atmWithdrawalsEnabled: { type: Boolean, default: true },
}, { timestamps: true });
exports.Card = (0, mongoose_1.model)("Card", cardSchema);
