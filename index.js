require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const session = require("express-session");
const ejs = require("ejs");
const passport = require("passport");
require("./passport-setup");
const router = require("./auth-route");
const path = require("path");

const app = express();

// -------------------------------------
// -------- Middlewares --------------
// -----------------------------------
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

// -----------------------------------
// ------- DB Connection ------------
// ---------------------------------

// mongoose.connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
// });

// ------------------------------
// ----------- Routes
// ------------------------------

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/chat", (req, res) => {
    res.render("chat", {
        user: {
            id: Math.floor(Math.random() * 10),
            name: "Gunjan Raj Tiwari",
            gang: "Gunjan",
            photo: "https://avatars.githubusercontent.com/u/54533347?v=4",
        },
    });
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

// -----------------------------------------
// ---------- Listening to the server
// -----------------------------------------
const server = app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running ...");
});

// ---------------------------------------
// ------------Socket Setup
//----------------------------------------
const io = socket(server, {
    cors: {
        origin: ["https://namesclash.netlify.app", "http://127.0.0.1:2000"],
    },
});

io.on("connection", (socket) => {
    socket.on("joinRoom", (user) => {
        socket.join(user.gang);

        socket.broadcast.to(user.gang).emit("typing", "Someone joined.");
    });

    socket.on("chat", (data) => {
        io.to(data.gang).emit("chat", data);
    });

    socket.on("typing", function (data) {
        socket.broadcast.to(data.gang).emit("typing", data.value);
    });
});
