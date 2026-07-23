import { Types } from "mongoose";
import { Notification, NotificationType } from "../models/Notification";

interface CreateNotificationInput {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  subtitle: string;
}

export const createNotification = async ({
  userId,
  type,
  title,
  subtitle,
}: CreateNotificationInput) => {
  return Notification.create({ user: userId, type, title, subtitle });
};
