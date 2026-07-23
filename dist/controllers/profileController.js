"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateSecuritySettings = exports.updateProfile = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const User_1 = require("../models/User");
const encryption_1 = require("../utils/encryption");
const toPublicUser = (user) => ({
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
const updateProfile = async (req, res) => {
    const { fullName, phone, avatarUrl } = req.body;
    const user = await User_1.User.findById(req.userId);
    if (!user)
        throw new errorHandler_1.AppError("User not found", 404);
    if (fullName)
        user.fullName = fullName;
    if (phone !== undefined)
        user.phone = phone;
    if (avatarUrl !== undefined)
        user.avatarUrl = avatarUrl;
    await user.save();
    res.json({ user: toPublicUser(user) });
};
exports.updateProfile = updateProfile;
const updateSecuritySettings = async (req, res) => {
    const { biometricEnabled, twoFactorEnabled } = req.body;
    const user = await User_1.User.findById(req.userId);
    if (!user)
        throw new errorHandler_1.AppError("User not found", 404);
    if (typeof biometricEnabled === "boolean")
        user.biometricEnabled = biometricEnabled;
    if (typeof twoFactorEnabled === "boolean")
        user.twoFactorEnabled = twoFactorEnabled;
    await user.save();
    res.json({ user: toPublicUser(user) });
};
exports.updateSecuritySettings = updateSecuritySettings;
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User_1.User.findById(req.userId).select("+passwordHash");
    if (!user)
        throw new errorHandler_1.AppError("User not found", 404);
    const matches = await (0, encryption_1.comparePassword)(currentPassword, user.passwordHash);
    if (!matches)
        throw new errorHandler_1.AppError("Current password is incorrect", 401);
    user.passwordHash = await (0, encryption_1.hashPassword)(newPassword);
    await user.save();
    res.json({ message: "Password changed successfully" });
};
exports.changePassword = changePassword;
