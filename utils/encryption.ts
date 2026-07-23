import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "../config/env";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto.createHash("sha256").update(env.jwtSecret).digest();

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (payload: string): string => {
  const [ivHex, dataHex] = payload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

export const hashPassword = async (plain: string): Promise<string> =>
  bcrypt.hash(plain, 10);
export const comparePassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(plain, hash);

export const generateOTPCode = (): string =>
  String(Math.floor(100000 + Math.random() * 900000));
export const hashOTP = async (code: string): Promise<string> =>
  bcrypt.hash(code, 8);
export const compareOTP = async (
  code: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(code, hash);
