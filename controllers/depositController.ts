import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Deposit } from "../models/Deposit";
import { Transaction } from "../models/Transaction";
import { createNotification } from "../services/notificationService";
import { findOwnedAccountOrThrow } from "./accountController";

const DEPOSIT_LIMIT = 100000;

export const createDeposit = async (req: AuthRequest, res: Response) => {
  const {
    accountId,
    amount,
    method = "atm",
    location = "ATM · Vinewood Blvd",
  } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("amount must be a positive number", 400);
  }
  if (amount > DEPOSIT_LIMIT) {
    throw new AppError(
      `amount exceeds the deposit limit of ${DEPOSIT_LIMIT}`,
      400,
    );
  }

  const account = await findOwnedAccountOrThrow(accountId, req.userId!);

  const transaction = await Transaction.create({
    account: account._id,
    user: req.userId,
    type: "deposit",
    title: "Deposit",
    subtitle: location,
    amount,
    referenceId: `dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  });

  await Deposit.create({
    transaction: transaction._id,
    account: account._id,
    method,
    location,
  });

  account.balance += amount;
  await account.save();

  await createNotification({
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
