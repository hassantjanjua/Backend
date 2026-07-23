import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Account } from "../models/Account";

const toPublicAccount = (account: InstanceType<typeof Account>) => ({
  id: account.id,
  label: account.label,
  type: account.type,
  accountNumber: account.accountNumber,
  balance: account.balance,
  currency: account.currency,
  isPrimary: account.isPrimary,
});

export const getAccounts = async (req: AuthRequest, res: Response) => {
  const accounts = await Account.find({ user: req.userId }).sort({
    isPrimary: -1,
    createdAt: 1,
  });
  res.json({ accounts: accounts.map(toPublicAccount) });
};

export const getAccount = async (req: AuthRequest, res: Response) => {
  const account = await Account.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!account) throw new AppError("Account not found", 404);
  res.json({ account: toPublicAccount(account) });
};

export const findOwnedAccountOrThrow = async (
  accountId: string,
  userId: string,
) => {
  const account = await Account.findOne({ _id: accountId, user: userId });
  if (!account) throw new AppError("Account not found", 404);
  return account;
};

export { toPublicAccount };

