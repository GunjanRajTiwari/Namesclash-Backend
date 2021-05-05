const express = require("express");
const socket = require("socket.io");

const corsOptions = {
    origin: "https://localhost:5500",
};

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
    res.redirect("/chat.html");
});

// Listening to the server
const server = app.listen(process.env.PORT || 8000, () => {
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
