import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import accountRoutes from "./routes/account";
import authRoutes from "./routes/auth";
import cardRoutes from "./routes/card";
import depositRoutes from "./routes/deposit";
import notificationRoutes from "./routes/notification";
import profileRoutes from "./routes/profile";
import transactionRoutes from "./routes/transaction";
import transferRoutes from "./routes/transfer";
import withdrawRoutes from "./routes/withdraw";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
