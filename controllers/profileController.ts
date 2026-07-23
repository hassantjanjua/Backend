import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { User } from "../models/User";
import { comparePassword, hashPassword } from "../utils/encryption";

const toPublicUser = (user: InstanceType<typeof User>) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  tier: user.tier,
  biometricEnabled: user.biometricEnabled,
  twoFactorEnabled: user.twoFactorEnabled,
  memberSince: user.get("createdAt"),
});

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { fullName, phone, avatarUrl } = req.body;

  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);

  if (fullName) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();

  res.json({ user: toPublicUser(user) });
};

export const updateSecuritySettings = async (
  req: AuthRequest,
  res: Response,
) => {
  const { biometricEnabled, twoFactorEnabled } = req.body;

  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);

  if (typeof biometricEnabled === "boolean")
    user.biometricEnabled = biometricEnabled;
  if (typeof twoFactorEnabled === "boolean")
    user.twoFactorEnabled = twoFactorEnabled;
  await user.save();

  res.json({ user: toPublicUser(user) });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId).select("+passwordHash");
  if (!user) throw new AppError("User not found", 404);

  const matches = await comparePassword(currentPassword, user.passwordHash);
  if (!matches) throw new AppError("Current password is incorrect", 401);

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  res.json({ message: "Password changed successfully" });
};
