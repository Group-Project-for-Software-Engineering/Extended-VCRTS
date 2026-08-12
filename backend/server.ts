import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
//------------------------------------------------------------------------------
//Implementation of the server to run the backend on 

//importing different API routes to traverse the application
//these can be found under the routes folder in the backend folder
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import adminPendingRoutes from "./routes/adminPendingRoutes"
import adminRemovalRoutes from "./routes/adminRemovalRoutes";
import adminRoutes from "./routes/adminRoutes";
import clientRoutes from "./routes/clientRoutes";
import homeRoutes from "./routes/homeRoutes";
import jobRoutes from "./routes/jobRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";


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
app.use("/dashboard", dashboardRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

