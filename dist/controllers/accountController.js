"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicAccount = exports.findOwnedAccountOrThrow = exports.getAccount = exports.getAccounts = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Account_1 = require("../models/Account");
const toPublicAccount = (account) => ({
    id: account.id,
    label: account.label,
    type: account.type,
    accountNumber: account.accountNumber,
    balance: account.balance,
    currency: account.currency,
    isPrimary: account.isPrimary,
});
exports.toPublicAccount = toPublicAccount;
const getAccounts = async (req, res) => {
    const accounts = await Account_1.Account.find({ user: req.userId }).sort({
        isPrimary: -1,
        createdAt: 1,
    });
    res.json({ accounts: accounts.map(toPublicAccount) });
};
exports.getAccounts = getAccounts;
const getAccount = async (req, res) => {
    const account = await Account_1.Account.findOne({
        _id: req.params.id,
        user: req.userId,
    });
    if (!account)
        throw new errorHandler_1.AppError("Account not found", 404);
    res.json({ account: toPublicAccount(account) });
};
exports.getAccount = getAccount;
const findOwnedAccountOrThrow = async (accountId, userId) => {
    const account = await Account_1.Account.findOne({ _id: accountId, user: userId });
    if (!account)
        throw new errorHandler_1.AppError("Account not found", 404);
    return account;
};
exports.findOwnedAccountOrThrow = findOwnedAccountOrThrow;
