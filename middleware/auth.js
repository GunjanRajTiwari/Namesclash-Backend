module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            return res.redirect("/");
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect("/profile");
        } else {
            next();
        }
    },
};
