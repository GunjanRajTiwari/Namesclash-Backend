const express = require("express");
const socket = require("socket.io");

const app = express();

// Routes
app.get("*", (req, res) => {
    res.send("<center>Welcome to Names Clash Backend</center>");
});

// Listening to the server
const server = app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running ...");
});

// Socket Setup
const io = socket(server, {
    cors: {
        origin: "https://namesclash.netlify.app/",
    },
});

io.on("connection", (socket) => {
    console.log("Made socket connection:", socket.id);

    socket.on("chat", (data) => {
        io.sockets.emit("chat", data);
    });
});
