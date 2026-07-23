import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Notification } from "../models/Notification";

const toPublicNotification = (n: InstanceType<typeof Notification>) => ({
  id: n.id,
  type: n.type,
  title: n.title,
  subtitle: n.subtitle,
  read: n.read,
  time: n.get("createdAt"),
});

export const listNotifications = async (req: AuthRequest, res: Response) => {
  const notifications = await Notification.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ notifications: notifications.map(toPublicNotification) });
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!notification) throw new AppError("Notification not found", 404);

  notification.read = true;
  await notification.save();

  res.json({ notification: toPublicNotification(notification) });
};

export const markAllNotificationsRead = async (
  req: AuthRequest,
  res: Response,
) => {
  await Notification.updateMany(
    { user: req.userId, read: false },
    { $set: { read: true } },
  );
  res.json({ message: "All notifications marked as read" });
};
