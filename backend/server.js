import { db } from "./config/db.js";
console.log("DB in server.js:", db);

import express from "express";
import cors from "cors";


import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import adminPendingRoutes from "./routes/adminPendingRoutes.js"
import adminRemovalRoutes from "./routes/adminRemovalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


const app = express();
app.use(express.json());
app.use(cors());

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/admin", adminPendingRoutes);
app.use("/api/admin", adminRemovalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

