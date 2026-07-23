"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareOTP = exports.hashOTP = exports.generateOTPCode = exports.comparePassword = exports.hashPassword = exports.decrypt = exports.encrypt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const ALGORITHM = "aes-256-cbc";
const KEY = crypto_1.default.createHash("sha256").update(env_1.env.jwtSecret).digest();
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};
exports.encrypt = encrypt;
const decrypt = (payload) => {
    const [ivHex, dataHex] = payload.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, KEY, iv);
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(dataHex, "hex")),
        decipher.final(),
    ]);
    return decrypted.toString("utf8");
};
exports.decrypt = decrypt;
const hashPassword = async (plain) => bcryptjs_1.default.hash(plain, 10);
exports.hashPassword = hashPassword;
const comparePassword = async (plain, hash) => bcryptjs_1.default.compare(plain, hash);
exports.comparePassword = comparePassword;
const generateOTPCode = () => String(Math.floor(100000 + Math.random() * 900000));
exports.generateOTPCode = generateOTPCode;
const hashOTP = async (code) => bcryptjs_1.default.hash(code, 8);
exports.hashOTP = hashOTP;
const compareOTP = async (code, hash) => bcryptjs_1.default.compare(code, hash);
exports.compareOTP = compareOTP;
