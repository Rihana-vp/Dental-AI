require("dotenv").config();

const express = require("express");
const path = require("path");
const chatRoutes = require("./src/routes/chatRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", chatRoutes);

// Root route — serves the chat interface
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ SmileCare Dental AI Assistant running on http://localhost:${PORT}`);
});

module.exports = app;
