import express from "express";
import cors from "cors";
import helmet from "helmet";
import v1Routes from "./routes/v1/index.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1", v1Routes);
app.get("/health", (_req, res) => res.redirect(307, "/api/v1/health"));

app.use(notFound);
app.use(errorHandler);

export default app;
