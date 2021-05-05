const express = require("express");
const socket = require("socket.io");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname + "public")));

// Routes
app.get("/", (req, res) => {
    res.sendFile("/public/chat.html");
});

app.get("/hello", (req, res) => {
    res.send("hello");
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
