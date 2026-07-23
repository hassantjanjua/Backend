import { Document, Schema, Types, model } from "mongoose";

export interface IWithdrawal extends Document {
  transaction: Types.ObjectId;
  account: Types.ObjectId;
  method: "atm" | "branch";
  location?: string;
  createdAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    method: { type: String, enum: ["atm", "branch"], default: "atm" },
    location: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Withdrawal = model<IWithdrawal>("Withdrawal", withdrawalSchema);
