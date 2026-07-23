import { Document, Schema, Types, model } from "mongoose";

export type NotificationType =
  | "deposit"
  | "withdraw"
  | "transfer"
  | "security"
  | "promo";

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  subtitle: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer", "security", "promo"],
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
