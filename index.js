const express = require("express");
const socket = require("socket.io");

const app = express();
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.sendFile("/public/chat.html");
});

// Listening to the server
const server = app.listen(process.env.PORT, () => {
    console.log("Server is running ...");
});

// Socket Setup
const io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection:", socket.id);

    socket.on("chat", (data) => {
        io.sockets.emit("chat", data);
    });
});
