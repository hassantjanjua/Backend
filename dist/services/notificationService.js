"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const Notification_1 = require("../models/Notification");
const createNotification = async ({ userId, type, title, subtitle, }) => {
    return Notification_1.Notification.create({ user: userId, type, title, subtitle });
};
exports.createNotification = createNotification;
