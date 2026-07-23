import { Document, Schema, Types, model } from "mongoose";

export type OTPPurpose = "register" | "reset_password";

export interface IOTP extends Document {
  user: Types.ObjectId;
  codeHash: string;
  purpose: OTPPurpose;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    codeHash: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["register", "reset_password"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = model<IOTP>("OTP", otpSchema);
