const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("./config/db");

const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {

    req.io = io;

    next();
});

app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
    res.send("Server Running");
});

io.on("connection", (socket) => {

    console.log("User Connected");

});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});