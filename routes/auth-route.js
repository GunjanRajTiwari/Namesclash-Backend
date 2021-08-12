const router = require("express").Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
    }),
    function (req, res) {
        res.redirect("/profile");
    }
);

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
