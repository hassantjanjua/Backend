import { Document, Schema, Types, model } from "mongoose";

export type TransactionType =
  | "deposit"
  | "withdraw"
  | "transfer_in"
  | "transfer_out"
  | "payment";

export interface ITransaction extends Document {
  account: Types.ObjectId;
  user: Types.ObjectId;
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number;
  date: Date;
  referenceId: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer_in", "transfer_out", "payment"],
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    referenceId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema,
);
