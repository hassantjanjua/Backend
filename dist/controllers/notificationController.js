"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsRead = exports.markNotificationRead = exports.listNotifications = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Notification_1 = require("../models/Notification");
const toPublicNotification = (n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    subtitle: n.subtitle,
    read: n.read,
    time: n.get("createdAt"),
});
const listNotifications = async (req, res) => {
    const notifications = await Notification_1.Notification.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .limit(100);
    res.json({ notifications: notifications.map(toPublicNotification) });
};
exports.listNotifications = listNotifications;
const markNotificationRead = async (req, res) => {
    const notification = await Notification_1.Notification.findOne({
        _id: req.params.id,
        user: req.userId,
    });
    if (!notification)
        throw new errorHandler_1.AppError("Notification not found", 404);
    notification.read = true;
    await notification.save();
    res.json({ notification: toPublicNotification(notification) });
};
exports.markNotificationRead = markNotificationRead;
const markAllNotificationsRead = async (req, res) => {
    await Notification_1.Notification.updateMany({ user: req.userId, read: false }, { $set: { read: true } });
    res.json({ message: "All notifications marked as read" });
};
exports.markAllNotificationsRead = markAllNotificationsRead;
