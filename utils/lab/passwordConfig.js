const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Lab = require("../../models/lab/Lab.js");

passport.serializeUser((lab, done) => {
    done(null, lab._id);
});

passport.deserializeUser((id, done) => {
    Lab.findById(id).then((lab) => {
        done(null, lab);
    });
});

// passport.use(
//     new LocalStrategy(
//         {
//             usernameField: "email",
//             passwordField: "password",
//         },
//         async (email, password, done) => {   //done(error,user)
//             try {
//                 const lab = await Lab.findOne({ "account.email": email });
//                 if (!lab) {
//                     return done(null, false, { message: "Email not found!" });
//                 }
//                 const passwordMatched = await bcrypt.compare(
//                     password,
//                     lab.account.password
//                 );
//                 if (!passwordMatched) {
//                     return done(null, false, { message: "Password incorrect" });
//                 }
//                 return done(null, lab);
//             } catch (err) {
//                 console.log(err);
//                 return done(null, false, { message: "Server Error" });
//             }
//         }
//     )
// );

module.exports = passport;
