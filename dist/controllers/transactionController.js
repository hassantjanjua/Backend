"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = exports.getTransaction = exports.listTransactions = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Transaction_1 = require("../models/Transaction");
const notificationService_1 = require("../services/notificationService");
const accountController_1 = require("./accountController");
const toPublicTransaction = (t) => ({
    id: t.id,
    type: t.type,
    title: t.title,
    subtitle: t.subtitle,
    amount: t.amount,
    date: t.date,
    accountId: t.account,
});
const listTransactions = async (req, res) => {
    const { filter = "all", accountId } = req.query;
    const query = { user: req.userId };
    if (accountId)
        query.account = accountId;
    if (filter === "in")
        query.amount = { $gt: 0 };
    if (filter === "out")
        query.amount = { $lt: 0 };
    const transactions = await Transaction_1.Transaction.find(query)
        .sort({ date: -1 })
        .limit(200);
    res.json({ transactions: transactions.map(toPublicTransaction) });
};
exports.listTransactions = listTransactions;
const getTransaction = async (req, res) => {
    const transaction = await Transaction_1.Transaction.findOne({
        _id: req.params.id,
        user: req.userId,
    });
    if (!transaction)
        throw new errorHandler_1.AppError("Transaction not found", 404);
    res.json({ transaction: toPublicTransaction(transaction) });
};
exports.getTransaction = getTransaction;
const createPayment = async (req, res) => {
    const { accountId, amount, merchantName } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
        throw new errorHandler_1.AppError("amount must be a positive number", 400);
    }
    if (!merchantName) {
        throw new errorHandler_1.AppError("merchantName is required", 400);
    }
    const account = await (0, accountController_1.findOwnedAccountOrThrow)(accountId, req.userId);
    if (amount > account.balance) {
        throw new errorHandler_1.AppError("Insufficient funds", 400);
    }
    const transaction = await Transaction_1.Transaction.create({
        account: account._id,
        user: req.userId,
        type: "payment",
        title: merchantName,
        subtitle: "QR payment",
        amount: -amount,
        referenceId: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });
    account.balance -= amount;
    await account.save();
    await (0, notificationService_1.createNotification)({
        userId: account.user,
        type: "transfer",
        title: "Payment sent",
        subtitle: `$${amount.toLocaleString("en-US")} paid to ${merchantName}`,
    });
    res.status(201).json({
        transaction: toPublicTransaction(transaction),
        newBalance: account.balance,
    });
};
exports.createPayment = createPayment;
