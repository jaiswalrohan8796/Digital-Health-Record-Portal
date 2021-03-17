const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user/User.js");
const Lab = require("../models/lab/Lab.js");

passport.serializeUser((person, done) => {
    done(null, person._id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }).then((user) => {
        if (!user) {
            Lab.findOne({ _id: id })
                .then((lab) => {
                    done(null, lab);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (user) {
            done(null, user);
        }
    });
});
//user passport-local
passport.use(
    "user-local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            //done(error,user)
            try {
                const user = await User.findOne({ "account.email": email });
                if (!user) {
                    return done(null, false, { message: "Email not found!" });
                }
                const passwordMatched = await bcrypt.compare(
                    password,
                    user.account.password
                );
                if (!passwordMatched) {
                    return done(null, false, { message: "Password incorrect" });
                }
                return done(null, user);
            } catch (e) {
                console.log(e);
                return done(null, false, { message: "Server Error" });
            }
        }
    )
);
//lab passport-local
passport.use(
    "lab-local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            //done(error,user)
            try {
                const lab = await Lab.findOne({ "account.email": email });
                if (!lab) {
                    return done(null, false, { message: "Email not found!" });
                }
                const passwordMatched = await bcrypt.compare(
                    password,
                    lab.account.password
                );
                if (!passwordMatched) {
                    return done(null, false, { message: "Password incorrect" });
                }
                return done(null, lab);
            } catch (err) {
                console.log(err);
                return done(null, false, { message: "Server Error" });
            }
        }
    )
);

module.exports = passport;
