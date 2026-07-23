import { Types } from "mongoose";
import { env } from "../config/env";
import { OTP, OTPPurpose } from "../models/OTP";
import { compareOTP, generateOTPCode, hashOTP } from "../utils/encryption";
import { logger } from "../utils/logger";

export const createOTP = async (
  userId: Types.ObjectId,
  purpose: OTPPurpose,
): Promise<string> => {
  const code = generateOTPCode();
  const codeHash = await hashOTP(code);
  const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  await OTP.create({ user: userId, codeHash, purpose, expiresAt });
  logger.info(`OTP generated for user ${userId} (${purpose})`, { code });

  return code;
};

export const verifyOTP = async (
  userId: Types.ObjectId,
  purpose: OTPPurpose,
  code: string,
): Promise<boolean> => {
  const candidates = await OTP.find({
    user: userId,
    purpose,
    used: false,
  }).sort({ createdAt: -1 });

  for (const candidate of candidates) {
    if (candidate.expiresAt < new Date()) continue;
    const matches = await compareOTP(code, candidate.codeHash);
    if (matches) {
      candidate.used = true;
      await candidate.save();
      return true;
    }
  }

  return false;
};
