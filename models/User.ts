import { Document, Schema, model } from "mongoose";

export type UserTier = "standard" | "gold" | "platinum";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatarUrl?: string;
  tier: UserTier;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String },
    tier: {
      type: String,
      enum: ["standard", "gold", "platinum"],
      default: "standard",
    },
    biometricEnabled: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
