import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Card } from "../models/Card";
import { encrypt } from "../utils/encryption";
import { generateCardNumber, generateExpiry } from "../utils/generateAccount";
import { findOwnedAccountOrThrow } from "./accountController";

const toPublicCard = (card: InstanceType<typeof Card>) => ({
  id: card.id,
  cardNumber: `•••• •••• •••• ${card.cardNumberLast4}`,
  expiry: card.expiry,
  type: card.type,
  label: card.label,
  frozen: card.frozen,
  onlinePaymentsEnabled: card.onlinePaymentsEnabled,
  atmWithdrawalsEnabled: card.atmWithdrawalsEnabled,
});

export const listCards = async (req: AuthRequest, res: Response) => {
  const cards = await Card.find({ user: req.userId }).sort({ createdAt: 1 });
  res.json({ cards: cards.map(toPublicCard) });
};

export const addCard = async (req: AuthRequest, res: Response) => {
  const { accountId, type = "physical", label } = req.body;

  const account = await findOwnedAccountOrThrow(accountId, req.userId!);

  const cardNumber = generateCardNumber();
  const last4 = cardNumber.replace(/\s/g, "").slice(-4);

  const card = await Card.create({
    user: req.userId,
    account: account._id,
    cardNumberLast4: last4,
    cardNumberEncrypted: encrypt(cardNumber),
    expiry: generateExpiry(),
    type,
    label,
  });

  res.status(201).json({ card: toPublicCard(card) });
};

export const setCardFrozen = async (req: AuthRequest, res: Response) => {
  const { frozen } = req.body;

  const card = await Card.findOne({ _id: req.params.id, user: req.userId });
  if (!card) throw new AppError("Card not found", 404);

  card.frozen = !!frozen;
  await card.save();

  res.json({ card: toPublicCard(card) });
};

export const updateCardSettings = async (req: AuthRequest, res: Response) => {
  const { onlinePaymentsEnabled, atmWithdrawalsEnabled } = req.body;

  const card = await Card.findOne({ _id: req.params.id, user: req.userId });
  if (!card) throw new AppError("Card not found", 404);

  if (typeof onlinePaymentsEnabled === "boolean")
    card.onlinePaymentsEnabled = onlinePaymentsEnabled;
  if (typeof atmWithdrawalsEnabled === "boolean")
    card.atmWithdrawalsEnabled = atmWithdrawalsEnabled;
  await card.save();

  res.json({ card: toPublicCard(card) });
};
