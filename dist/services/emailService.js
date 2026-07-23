"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.emailHost,
    port: env_1.env.emailPort,
    secure: false,
    auth: {
        user: env_1.env.emailUser,
        pass: env_1.env.emailPass,
    },
});
const sendEmail = async ({ to, subject, body, }) => {
    await transporter.sendMail({
        from: `"Maze Bank" <${env_1.env.emailFrom}>`,
        to,
        subject,
        text: body,
    });
    logger_1.logger.info(`Email sent to ${to}`);
};
exports.sendEmail = sendEmail;
const sendOTPEmail = async (to, code) => {
    await (0, exports.sendEmail)({
        to,
        subject: "Your Maze Bank Verification Code",
        body: `Your verification code is ${code}. It expires in ${env_1.env.otpExpiryMinutes} minutes.`,
    });
};
exports.sendOTPEmail = sendOTPEmail;
