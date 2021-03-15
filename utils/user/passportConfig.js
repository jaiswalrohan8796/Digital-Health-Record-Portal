const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../models/user/User.js");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use('user-local',
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

module.exports = passport;
