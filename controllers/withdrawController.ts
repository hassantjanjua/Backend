import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Transaction } from "../models/Transaction";
import { Withdrawal } from "../models/Withdrawal";
import { createNotification } from "../services/notificationService";
import { findOwnedAccountOrThrow } from "./accountController";

export const createWithdrawal = async (req: AuthRequest, res: Response) => {
  const {
    accountId,
    amount,
    method = "atm",
    location = "ATM · Del Perro Pier",
  } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("amount must be a positive number", 400);
  }

  const account = await findOwnedAccountOrThrow(accountId, req.userId!);

  if (amount > account.balance) {
    throw new AppError("Insufficient funds", 400);
  }

  const transaction = await Transaction.create({
    account: account._id,
    user: req.userId,
    type: "withdraw",
    title: "Withdrawal",
    subtitle: location,
    amount: -amount,
    referenceId: `wd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  });

  await Withdrawal.create({
    transaction: transaction._id,
    account: account._id,
    method,
    location,
  });

  account.balance -= amount;
  await account.save();

  await createNotification({
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
