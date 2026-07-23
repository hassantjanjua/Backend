import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Transaction } from "../models/Transaction";
import { createNotification } from "../services/notificationService";
import { findOwnedAccountOrThrow } from "./accountController";

const toPublicTransaction = (t: InstanceType<typeof Transaction>) => ({
  id: t.id,
  type: t.type,
  title: t.title,
  subtitle: t.subtitle,
  amount: t.amount,
  date: t.date,
  accountId: t.account,
});

export const listTransactions = async (req: AuthRequest, res: Response) => {
  const { filter = "all", accountId } = req.query as {
    filter?: string;
    accountId?: string;
  };

  const query: Record<string, unknown> = { user: req.userId };
  if (accountId) query.account = accountId;
  if (filter === "in") query.amount = { $gt: 0 };
  if (filter === "out") query.amount = { $lt: 0 };

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(200);
  res.json({ transactions: transactions.map(toPublicTransaction) });
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!transaction) throw new AppError("Transaction not found", 404);
  res.json({ transaction: toPublicTransaction(transaction) });
};

export const createPayment = async (req: AuthRequest, res: Response) => {
  const { accountId, amount, merchantName } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("amount must be a positive number", 400);
  }
  if (!merchantName) {
    throw new AppError("merchantName is required", 400);
  }

  const account = await findOwnedAccountOrThrow(accountId, req.userId!);

  if (amount > account.balance) {
    throw new AppError("Insufficient funds", 400);
  }

  const transaction = await Transaction.create({
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

  await createNotification({
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
