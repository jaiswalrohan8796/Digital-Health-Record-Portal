const router = require("express").Router();
const passport = require("passport");

const User = require("../../models/user/User.js");
require("../../utils/user/passportConfig.js");

//routes
router.post(
    "/user/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/user/login",
        failureFlash: true,
    })
);

router.post("/user/register", async (req, res, next) => {
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
        const alreadyUser = await User.find({ "account.email": email });
        if (alreadyUser.length > 0) {
            return res.redirect("/user/register");
        }
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
                password: password,
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
