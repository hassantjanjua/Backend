import { Router } from "express";
import {
    listNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../controllers/notificationController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listNotifications));
router.patch("/read-all", asyncHandler(markAllNotificationsRead));
router.patch("/:id/read", asyncHandler(markNotificationRead));

export default router;
