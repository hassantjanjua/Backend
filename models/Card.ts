import { Document, Schema, Types, model } from "mongoose";

export type CardType = "physical" | "virtual";

export interface ICard extends Document {
  user: Types.ObjectId;
  account: Types.ObjectId;
  cardNumberLast4: string;
  cardNumberEncrypted: string;
  expiry: string;
  type: CardType;
  label?: string;
  frozen: boolean;
  onlinePaymentsEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    cardNumberLast4: { type: String, required: true },
    cardNumberEncrypted: { type: String, required: true, select: false },
    expiry: { type: String, required: true },
    type: { type: String, enum: ["physical", "virtual"], default: "physical" },
    label: { type: String },
    frozen: { type: Boolean, default: false },
    onlinePaymentsEnabled: { type: Boolean, default: true },
    atmWithdrawalsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Card = model<ICard>("Card", cardSchema);
