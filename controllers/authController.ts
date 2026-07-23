import { Response } from "express";
import { signToken } from "../config/jwt";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Account } from "../models/Account";
import { User } from "../models/User";
import { sendOTPEmail } from "../services/emailService";
import { createOTP, verifyOTP } from "../services/otpService";
import { comparePassword, hashPassword } from "../utils/encryption";
import { generateAccountNumber } from "../utils/generateAccount";

const toPublicUser = (user: InstanceType<typeof User>) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  tier: user.tier,
  memberSince: user.get("createdAt"),
});

export const register = async (req: AuthRequest, res: Response) => {
  const { fullName, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing)
    throw new AppError("An account with this email already exists", 409);

  const passwordHash = await hashPassword(password);
  const user = await User.create({ fullName, email, passwordHash });

  const code = await createOTP(user._id, "register");
  await sendOTPEmail(user.email, code);

  res.status(201).json({
    message: "Account created. Check your email for a verification code.",
    userId: user.id,
  });
};

export const verifyRegistrationOTP = async (
  req: AuthRequest,
  res: Response,
) => {
  const { userId, code } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const valid = await verifyOTP(user._id, "register", code);
  if (!valid) throw new AppError("Invalid or expired code", 400);

  const existingAccount = await Account.findOne({ user: user._id });
  if (!existingAccount) {
    await Account.create({
      user: user._id,
      label: "Primary Checking",
      type: "checking",
      accountNumber: generateAccountNumber(),
      balance: 0,
      isPrimary: true,
    });
  }

  const token = signToken({ userId: user.id });
  res.json({ token, user: toPublicUser(user) });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );
  if (!user) throw new AppError("Invalid email or password", 401);

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) throw new AppError("Invalid email or password", 401);

  const token = signToken({ userId: user.id });
  res.json({ token, user: toPublicUser(user) });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);
  res.json({ user: toPublicUser(user) });
};

export const forgotPassword = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    const code = await createOTP(user._id, "reset_password");
    await sendOTPEmail(user.email, code);
  }

  res.json({ message: "If that email exists, a reset code has been sent." });
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError("Invalid or expired code", 400);

  const valid = await verifyOTP(user._id, "reset_password", code);
  if (!valid) throw new AppError("Invalid or expired code", 400);

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  res.json({ message: "Password reset successfully." });
};
