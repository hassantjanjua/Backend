"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithdrawal = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Transaction_1 = require("../models/Transaction");
const Withdrawal_1 = require("../models/Withdrawal");
const notificationService_1 = require("../services/notificationService");
const accountController_1 = require("./accountController");
const createWithdrawal = async (req, res) => {
    const { accountId, amount, method = "atm", location = "ATM · Del Perro Pier", } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
        throw new errorHandler_1.AppError("amount must be a positive number", 400);
    }
    const account = await (0, accountController_1.findOwnedAccountOrThrow)(accountId, req.userId);
    if (amount > account.balance) {
        throw new errorHandler_1.AppError("Insufficient funds", 400);
    }
    const transaction = await Transaction_1.Transaction.create({
        account: account._id,
        user: req.userId,
        type: "withdraw",
        title: "Withdrawal",
        subtitle: location,
        amount: -amount,
        referenceId: `wd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });
    await Withdrawal_1.Withdrawal.create({
        transaction: transaction._id,
        account: account._id,
        method,
        location,
    });
    account.balance -= amount;
    await account.save();
    await (0, notificationService_1.createNotification)({
        userId: account.user,
        type: "withdraw",
        title: "Withdrawal alert",
        subtitle: `$${amount.toLocaleString("en-US")} withdrawn · ${location}`,
    });
    res.status(201).json({
        transaction: {
            id: transaction.id,
            type: transaction.type,
            title: transaction.title,
            subtitle: transaction.subtitle,
            amount: transaction.amount,
            date: transaction.date,
            accountId: account.id,
        },
        newBalance: account.balance,
    });
};
exports.createWithdrawal = createWithdrawal;
