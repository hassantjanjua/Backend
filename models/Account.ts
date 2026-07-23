import { Document, Schema, Types, model } from "mongoose";

export type AccountType = "checking" | "savings" | "business";

export interface IAccount extends Document {
  user: Types.ObjectId;
  label: string;
  type: AccountType;
  accountNumber: string;
  balance: number;
  currency: "USD";
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["checking", "savings", "business"],
      required: true,
    },
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "USD" },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Account = model<IAccount>("Account", accountSchema);
