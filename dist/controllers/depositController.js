"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeposit = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Deposit_1 = require("../models/Deposit");
const Transaction_1 = require("../models/Transaction");
const notificationService_1 = require("../services/notificationService");
const accountController_1 = require("./accountController");
const DEPOSIT_LIMIT = 100000;
const createDeposit = async (req, res) => {
    const { accountId, amount, method = "atm", location = "ATM · Vinewood Blvd", } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
        throw new errorHandler_1.AppError("amount must be a positive number", 400);
    }
    if (amount > DEPOSIT_LIMIT) {
        throw new errorHandler_1.AppError(`amount exceeds the deposit limit of ${DEPOSIT_LIMIT}`, 400);
    }
    const account = await (0, accountController_1.findOwnedAccountOrThrow)(accountId, req.userId);
    const transaction = await Transaction_1.Transaction.create({
        account: account._id,
        user: req.userId,
        type: "deposit",
        title: "Deposit",
        subtitle: location,
        amount,
        referenceId: `dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });
    await Deposit_1.Deposit.create({
        transaction: transaction._id,
        account: account._id,
        method,
        location,
    });
    account.balance += amount;
    await account.save();
    await (0, notificationService_1.createNotification)({
        userId: account.user,
        type: "deposit",
        title: "Deposit received",
        subtitle: `$${amount.toLocaleString("en-US")} deposited · ${location}`,
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
exports.createDeposit = createDeposit;
