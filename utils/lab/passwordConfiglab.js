const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../models/user/User.js");
const Lab = require("../../models/lab/Lab.js");

passport.serializeUser((person, done) => {
    done(null, person._id);
});

passport.deserializeUser((id, done) => {
    console.log("deserialize called");
    User.findOne({ _id: id }).then((user) => {
        if (!user) {
            console.log("no user found");
            Lab.findOne({ _id: id })
                .then((lab) => {
                    console.log("lab found");
                    done(null, lab);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (user) {
            console.log("user found");
            done(null, user);
        }
    });
});

passport.use(
    "lab-local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            console.log("lab passport called");
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
                console.log("passport  authenticate done");
                return done(null, lab);
            } catch (err) {
                console.log(err);
                return done(null, false, { message: "Server Error" });
            }
        }
    )
);

module.exports = passport;
