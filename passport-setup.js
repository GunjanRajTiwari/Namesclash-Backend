require("dotenv").config();
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("./models/User");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Gang = require("./models/Gang");

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

async function updateGang(gang) {
    await Gang.findOneAndUpdate(
        { name: gang },
        {
            name: gang,
            $inc: {
                comrades: 1,
            },
        },
        { upsert: true }
    );
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // console.log(profile.id);
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    done(null, user);
                } else {
                    const newUser = {
                        googleId: profile.id,
                        name: profile.displayName,
                        gang: profile.name.givenName.split(" ")[0].toLowerCase(),
                        photoUrl: profile.photos[0].value,
                    };
                    user = await User.create(newUser);
                    updateGang(newUser.gang);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
            }
        }
    )
);
