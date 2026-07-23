import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: false,
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async ({
  to,
  subject,
  body,
}: EmailPayload): Promise<void> => {
  await transporter.sendMail({
    from: `"Maze Bank" <${env.emailFrom}>`,
    to,
    subject,
    text: body,
  });

  logger.info(`Email sent to ${to}`);
};

export const sendOTPEmail = async (to: string, code: string): Promise<void> => {
  await sendEmail({
    to,
    subject: "Your Maze Bank Verification Code",
    body: `Your verification code is ${code}. It expires in ${env.otpExpiryMinutes} minutes.`,
  });
};
