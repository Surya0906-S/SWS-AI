const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

app.use(express.json());

// 🔥 IMPORTANT: Make uploads visible in browser
app.use("/uploads", express.static("uploads"));

// Attach socket to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
});

server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});