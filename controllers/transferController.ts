import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import { Transfer } from "../models/Transfer";
import { createNotification } from "../services/notificationService";
import { findOwnedAccountOrThrow } from "./accountController";

interface CreateTransferBody {
  fromAccountId: string;
  amount: number;
  recipientName: string;
  recipientBankLabel?: string;
  toAccountNumber?: string;
}

export const createTransfer = async (req: AuthRequest, res: Response) => {
  const {
    fromAccountId,
    amount,
    recipientName,
    recipientBankLabel,
    toAccountNumber,
  } = req.body as CreateTransferBody;

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("amount must be a positive number", 400);
  }
  if (!recipientName) {
    throw new AppError("recipientName is required", 400);
  }

  const fromAccount = await findOwnedAccountOrThrow(fromAccountId, req.userId!);

  if (amount > fromAccount.balance) {
    throw new AppError("Insufficient funds", 400);
  }

  const toAccount = toAccountNumber
    ? await Account.findOne({ accountNumber: toAccountNumber })
    : null;

  const outgoingTransaction = await Transaction.create({
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
    incomingTransaction = await Transaction.create({
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

    await createNotification({
      userId: toAccount.user,
      type: "transfer",
      title: "Transfer received",
      subtitle: `$${amount.toLocaleString("en-US")} received`,
    });
  }

  await Transfer.create({
    fromAccount: fromAccount._id,
    toAccount: toAccount?._id,
    recipientName,
    recipientBankLabel,
    outgoingTransaction: outgoingTransaction._id,
    incomingTransaction: incomingTransaction?._id,
    amount,
  });

  await createNotification({
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
