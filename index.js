const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const ejs = require("ejs");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("./passport-setup");
const router = require("./auth-route");
const path = require("path");
const { ensureAuth, ensureGuest } = require("./middleware/auth");

const connectDB = require("./config/db");

dotenv.config();

connectDB();
const User = require("./models/User");
const Gang = require("./models/Gang");

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
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);
// app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

// ------------------------------
// ----------- Routes
// ------------------------------

app.get("/", ensureGuest, (req, res) => {
    res.render("login");
});

app.get("/chat", ensureAuth, (req, res) => {
    // console.log(req.session);
    // res.render("chat", {
    //     user: {
    //         id: Math.floor(Math.random() * 10),
    //         name: "Gunjan Raj Tiwari",
    //         gang: "Gunjan",
    //         photo: "https://avatars.githubusercontent.com/u/54533347?v=4",
    //     },
    // });
    res.render("chat", { user: req.user });
});

app.get("/profile", ensureAuth, (req, res) => {
    // console.log(req.user);
    res.render("profile", { user: req.user });
});

app.get("/rank", ensureAuth, async (req, res) => {
    Gang.find()
        .sort({ comrades: -1 })
        .limit(10)
        .exec()
        .then((gang) => {
            res.render("rank", { gang: gang });
        });
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
        origin: ["http://namesclash.herokuapp.com/", "http://127.0.0.1:2000"],
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
