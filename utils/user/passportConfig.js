const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require('../../models/user/User.js')

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password,done ) {
            User.findOne({"account.email": email},function (err,user) {
                if (err) {
                    return done(null,false, { message:"Server Error"})
                }
                if (!user) {
                    return done(null,false, { message:"Email not found"})
                }
                if (user.account.password !== password) {
                    return done(null,false, { message:"Password is incorrect"})
                }
                return done(null,user)
            })
        }
    )

)