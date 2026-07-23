import { Document, Schema, Types, model } from "mongoose";

export interface IDeposit extends Document {
  transaction: Types.ObjectId;
  account: Types.ObjectId;
  method: "atm" | "branch" | "mobile_check";
  location?: string;
  createdAt: Date;
}

const depositSchema = new Schema<IDeposit>(
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
    method: {
      type: String,
      enum: ["atm", "branch", "mobile_check"],
      default: "atm",
    },
    location: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Deposit = model<IDeposit>("Deposit", depositSchema);
