const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../../models/user/User.js");
require("../../utils/user/passportConfig.js");

//routes
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/user/dashboard",
        failureRedirect: "/user/login",
        failureFlash: true,
    })
);

router.post("register", async (req, res, next) => {
    const {
        firstName,
        lastName,
        address,
        state,
        city,
        pincode,
        email,
        mobileNo,
        DOB,
        gender,
        bloodGroup,
        password,
        confirmPassword,
    } = req.body;
    if (password !== confirmPassword) {
        return res.redirect("/user/register");
    }
    try {
        const alreadyUser = await User.findOne({ "account.email": email });
        if (alreadyUser) {
            return res.redirect("/user/register");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            profile: {
                firstName: firstName,
                lastName: lastName,
                DOB: DOB,
                gender: gender,
                mobileNo: mobileNo,
                address: address,
                state: state,
                city: city,
            },
            account: {
                email: email,
                password: hashedPassword,
            },
        });
        const saved = newUser.save();
        if (!saved) {
            return res.redirect("/user/register");
        }
        return res.redirect("/user/login");
    } catch (e) {
        console.log(e);
        res.redirect("/user/register");
    }
});

module.exports = router;
