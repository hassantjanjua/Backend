"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCardSettings = exports.setCardFrozen = exports.addCard = exports.listCards = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Card_1 = require("../models/Card");
const encryption_1 = require("../utils/encryption");
const generateAccount_1 = require("../utils/generateAccount");
const accountController_1 = require("./accountController");
const toPublicCard = (card) => ({
    id: card.id,
    cardNumber: `•••• •••• •••• ${card.cardNumberLast4}`,
    expiry: card.expiry,
    type: card.type,
    label: card.label,
    frozen: card.frozen,
    onlinePaymentsEnabled: card.onlinePaymentsEnabled,
    atmWithdrawalsEnabled: card.atmWithdrawalsEnabled,
});
const listCards = async (req, res) => {
    const cards = await Card_1.Card.find({ user: req.userId }).sort({ createdAt: 1 });
    res.json({ cards: cards.map(toPublicCard) });
};
exports.listCards = listCards;
const addCard = async (req, res) => {
    const { accountId, type = "physical", label } = req.body;
    const account = await (0, accountController_1.findOwnedAccountOrThrow)(accountId, req.userId);
    const cardNumber = (0, generateAccount_1.generateCardNumber)();
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    const card = await Card_1.Card.create({
        user: req.userId,
        account: account._id,
        cardNumberLast4: last4,
        cardNumberEncrypted: (0, encryption_1.encrypt)(cardNumber),
        expiry: (0, generateAccount_1.generateExpiry)(),
        type,
        label,
    });
    res.status(201).json({ card: toPublicCard(card) });
};
exports.addCard = addCard;
const setCardFrozen = async (req, res) => {
    const { frozen } = req.body;
    const card = await Card_1.Card.findOne({ _id: req.params.id, user: req.userId });
    if (!card)
        throw new errorHandler_1.AppError("Card not found", 404);
    card.frozen = !!frozen;
    await card.save();
    res.json({ card: toPublicCard(card) });
};
exports.setCardFrozen = setCardFrozen;
const updateCardSettings = async (req, res) => {
    const { onlinePaymentsEnabled, atmWithdrawalsEnabled } = req.body;
    const card = await Card_1.Card.findOne({ _id: req.params.id, user: req.userId });
    if (!card)
        throw new errorHandler_1.AppError("Card not found", 404);
    if (typeof onlinePaymentsEnabled === "boolean")
        card.onlinePaymentsEnabled = onlinePaymentsEnabled;
    if (typeof atmWithdrawalsEnabled === "boolean")
        card.atmWithdrawalsEnabled = atmWithdrawalsEnabled;
    await card.save();
    res.json({ card: toPublicCard(card) });
};
exports.updateCardSettings = updateCardSettings;
