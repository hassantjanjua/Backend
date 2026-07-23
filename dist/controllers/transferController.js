"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransfer = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Account_1 = require("../models/Account");
const Transaction_1 = require("../models/Transaction");
const Transfer_1 = require("../models/Transfer");
const notificationService_1 = require("../services/notificationService");
const accountController_1 = require("./accountController");
const createTransfer = async (req, res) => {
    const { fromAccountId, amount, recipientName, recipientBankLabel, toAccountNumber, } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
        throw new errorHandler_1.AppError("amount must be a positive number", 400);
    }
    if (!recipientName) {
        throw new errorHandler_1.AppError("recipientName is required", 400);
    }
    const fromAccount = await (0, accountController_1.findOwnedAccountOrThrow)(fromAccountId, req.userId);
    if (amount > fromAccount.balance) {
        throw new errorHandler_1.AppError("Insufficient funds", 400);
    }
    const toAccount = toAccountNumber
        ? await Account_1.Account.findOne({ accountNumber: toAccountNumber })
        : null;
    const outgoingTransaction = await Transaction_1.Transaction.create({
        account: fromAccount._id,
        user: req.userId,
        type: "transfer_out",
        title: `Transfer to ${recipientName}`,
        subtitle: recipientBankLabel ?? "Maze Bank Transfer",
        amount: -amount,
        referenceId: `xfer_out_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });
    fromAccount.balance -= amount;
    await fromAccount.save();
    let incomingTransaction = null;
    if (toAccount) {
        incomingTransaction = await Transaction_1.Transaction.create({
            account: toAccount._id,
            user: toAccount.user,
            type: "transfer_in",
            title: "Transfer received",
            subtitle: "Maze Bank Transfer",
            amount,
            referenceId: `xfer_in_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        });
        toAccount.balance += amount;
        await toAccount.save();
        await (0, notificationService_1.createNotification)({
            userId: toAccount.user,
            type: "transfer",
            title: "Transfer received",
            subtitle: `$${amount.toLocaleString("en-US")} received`,
        });
    }
    await Transfer_1.Transfer.create({
        fromAccount: fromAccount._id,
        toAccount: toAccount?._id,
        recipientName,
        recipientBankLabel,
        outgoingTransaction: outgoingTransaction._id,
        incomingTransaction: incomingTransaction?._id,
        amount,
    });
    await (0, notificationService_1.createNotification)({
        userId: fromAccount.user,
        type: "transfer",
        title: "Transfer sent",
        subtitle: `$${amount.toLocaleString("en-US")} sent to ${recipientName}`,
    });
    res.status(201).json({
        transaction: {
            id: outgoingTransaction.id,
            type: outgoingTransaction.type,
            title: outgoingTransaction.title,
            subtitle: outgoingTransaction.subtitle,
            amount: outgoingTransaction.amount,
            date: outgoingTransaction.date,
            accountId: fromAccount.id,
        },
        newBalance: fromAccount.balance,
    });
};
exports.createTransfer = createTransfer;
