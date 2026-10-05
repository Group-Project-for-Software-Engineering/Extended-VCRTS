"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//------------------------------------------------------------------------------
//Implementation of the server to run the backend on 
//importing different API routes to traverse the application
//these can be found under the routes folder in the backend folder
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const adminPendingRoutes_1 = __importDefault(require("./routes/adminPendingRoutes"));
const adminRemovalRoutes_1 = __importDefault(require("./routes/adminRemovalRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// API ROUTES
app.use("/api/users", userRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/vehicles", vehicleRoutes_1.default);
app.use("/api/admin", adminPendingRoutes_1.default);
app.use("/api/admin", adminRemovalRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/client", clientRoutes_1.default);
app.use("/api/home", homeRoutes_1.default);
app.use("/api/jobs", jobRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/dashboard", dashboardRoutes_1.default);
app.listen(5000, () => console.log("Server running on port 5000"));
