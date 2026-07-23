"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getMe = exports.login = exports.verifyRegistrationOTP = exports.register = void 0;
const jwt_1 = require("../config/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const Account_1 = require("../models/Account");
const User_1 = require("../models/User");
const emailService_1 = require("../services/emailService");
const otpService_1 = require("../services/otpService");
const encryption_1 = require("../utils/encryption");
const generateAccount_1 = require("../utils/generateAccount");
const toPublicUser = (user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    tier: user.tier,
    memberSince: user.get("createdAt"),
});
const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    const existing = await User_1.User.findOne({ email: email.toLowerCase() });
    if (existing)
        throw new errorHandler_1.AppError("An account with this email already exists", 409);
    const passwordHash = await (0, encryption_1.hashPassword)(password);
    const user = await User_1.User.create({ fullName, email, passwordHash });
    const code = await (0, otpService_1.createOTP)(user._id, "register");
    await (0, emailService_1.sendOTPEmail)(user.email, code);
    res.status(201).json({
        message: "Account created. Check your email for a verification code.",
        userId: user.id,
    });
};
exports.register = register;
const verifyRegistrationOTP = async (req, res) => {
    const { userId, code } = req.body;
    const user = await User_1.User.findById(userId);
    if (!user)
        throw new errorHandler_1.AppError("User not found", 404);
    const valid = await (0, otpService_1.verifyOTP)(user._id, "register", code);
    if (!valid)
        throw new errorHandler_1.AppError("Invalid or expired code", 400);
    const existingAccount = await Account_1.Account.findOne({ user: user._id });
    if (!existingAccount) {
        await Account_1.Account.create({
            user: user._id,
            label: "Primary Checking",
            type: "checking",
            accountNumber: (0, generateAccount_1.generateAccountNumber)(),
            balance: 0,
            isPrimary: true,
        });
    }
    const token = (0, jwt_1.signToken)({ userId: user.id });
    res.json({ token, user: toPublicUser(user) });
};
exports.verifyRegistrationOTP = verifyRegistrationOTP;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user)
        throw new errorHandler_1.AppError("Invalid email or password", 401);
    const matches = await (0, encryption_1.comparePassword)(password, user.passwordHash);
    if (!matches)
        throw new errorHandler_1.AppError("Invalid email or password", 401);
    const token = (0, jwt_1.signToken)({ userId: user.id });
    res.json({ token, user: toPublicUser(user) });
};
exports.login = login;
const getMe = async (req, res) => {
    const user = await User_1.User.findById(req.userId);
    if (!user)
        throw new errorHandler_1.AppError("User not found", 404);
    res.json({ user: toPublicUser(user) });
};
exports.getMe = getMe;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User_1.User.findOne({ email: email.toLowerCase() });
    if (user) {
        const code = await (0, otpService_1.createOTP)(user._id, "reset_password");
        await (0, emailService_1.sendOTPEmail)(user.email, code);
    }
    res.json({ message: "If that email exists, a reset code has been sent." });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    const user = await User_1.User.findOne({ email: email.toLowerCase() });
    if (!user)
        throw new errorHandler_1.AppError("Invalid or expired code", 400);
    const valid = await (0, otpService_1.verifyOTP)(user._id, "reset_password", code);
    if (!valid)
        throw new errorHandler_1.AppError("Invalid or expired code", 400);
    user.passwordHash = await (0, encryption_1.hashPassword)(newPassword);
    await user.save();
    res.json({ message: "Password reset successfully." });
};
exports.resetPassword = resetPassword;
