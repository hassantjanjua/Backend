import { Document, Schema, Types, model } from "mongoose";

export interface ITransfer extends Document {
  fromAccount: Types.ObjectId;
  toAccount?: Types.ObjectId;
  recipientName: string;
  recipientBankLabel?: string;
  outgoingTransaction: Types.ObjectId;
  incomingTransaction?: Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const transferSchema = new Schema<ITransfer>(
  {
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    toAccount: { type: Schema.Types.ObjectId, ref: "Account" },
    recipientName: { type: String, required: true },
    recipientBankLabel: { type: String },
    outgoingTransaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    incomingTransaction: { type: Schema.Types.ObjectId, ref: "Transaction" },
    amount: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Transfer = model<ITransfer>("Transfer", transferSchema);
