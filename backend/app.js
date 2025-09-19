import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import bodyParser from "body-parser";
import config from "./config/config.js";
import http from "http";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import compression from "compression";
import errorHandler from "./middlewares/error.js";
import authRouter from "./routes/auth.routes.js";
import webSocketService from "./services/websocket.service.js";
import hackathonRouter from "./routes/hackthon.routes.js";
import teamRouter from "./routes/team.routes.js";
import messageRouter from "./routes/message.routes.js";

// Required for __dirname in ES modules
import { fileURLToPath } from "url";
import { dirname } from "path";
import { startScheduler } from "./utils/schedular.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Init express app
const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("combined", { stream: logger.stream }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    data: { message: "API is running" },
    message: "Welcome to the API",
    errorCode: 0,
  });
});

app.use("/api/user", authRouter);
app.use("/api/hackathons", hackathonRouter);
app.use("/teams", teamRouter);
app.use("/messages", messageRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route not found: ${req.originalUrl}`,
    errorCode: 3, // NOT_FOUND
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = config.server.port;
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// WebSocket service
webSocketService.initialize(server);

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Export app and server
export { app, server };
