const router = require("express").Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/failed", (req, res) => {
    res.render("login", { error: "Failed to login" });
});

router.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: "/failed",
    }),
    function (req, res) {
        res.render("profile", { user: req.user });
    }
);

module.exports = router;
