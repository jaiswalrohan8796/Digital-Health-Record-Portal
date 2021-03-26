const router = require("express").Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const transporter = require("../utils/email.js");
const User = require("../models/user/User.js");

//USER
//get forgotpassword page
router.get("/forgotpassword", (req, res, next) => {
    res.render("user/forgotpassword", { error: "", status: "" });
});
//submitted email for link
router.post("/forgotpassword", async (req, res, next) => {
    const email = req.body.email;
    try {
        var validUser = await User.findOne({ "account.email": email });
        if (!validUser) {
            return res.render("user/forgotpassword", {
                error: "Email not found",
                status: "",
            });
        }
        let token;
        buffer = await crypto.randomBytes(32);
        if (!buffer) {
            return res.render("user/forgotpassword", {
                error: "Server Error",
                status: "",
            });
        }
        token = buffer.toString("hex");
        console.log(token);
        validUser.account.resetToken = token;
        validUser.account.resetTokenExpiration = Date.now() + 3600000;
        const saved = await validUser.save();
        console.log(validUser);
        const message = {
            to: email,
            from: "Rohan Jaiswal <ronjazz8796@gmail.com>",
            subject: "Reset Password!",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>Set a new Password at <a href="http://localhost:3000/user/new-password/${token}">this link</a></h4>
                    `,
        };
        //send link to reset password
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
                return res.render("user/forgotpassword", {
                    error: "Server Error",
                    status: "",
                });
            } else {
                console.log("Email sent successfully");
                res.render("user/login", {
                    error: "",
                    status: "Password reset link mailed to you",
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.render("user/forgotpassword", {
            error: "Server Error",
            status: "",
        });
    }
});

router.get("/new-password/:token", (req, res, next) => {
    token = req.params.token;
    res.render("user/newpassword", { error: "", status: "", token: token });
});

router.post("/new-password", async (req, res, next) => {
    const { token, password, cpassword } = req.body;
    if (password !== cpassword) {
        return res.render("user/newpassword", {
            error: "Password not matched",
            status: "",
            token: token,
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.findOne({ "account.resetToken": token });
        if (!user) {
            return res.render("user/newpassword", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (user.account.resetTokenExpiration < Date.now()) {
            return res.render("user/newpassword", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        user.account.password = hashedPassword;
        user.account.resetToken = undefined;
        user.account.resetTokenExpiration = Date.now();
        const saved = await user.save();
        if (!saved) {
            return res.render("user/newpassword", {
                error: "Cannot update password at the moment",
                status: "",
                token: token,
            });
        }
        //if success , redirect user to login
        res.render("user/login", {
            error: "",
            status: "Password reset successfull, now login",
        });
        //notify user about new password set
        const message = {
            to: user.account.email,
            from: "Rohan Jaiswal <ronjazz8796@gmail.com>",
            subject: "New Password set successfully",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>You changed your password just now. If it wasn't you then report to us <a href="http://localhost:3000/user/forgotpassword">by clicking here</a></h4>
                    `,
        };
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    } catch (e) {
        console.log(e);
        res.render("user/newpassword", {
            error: "Server Error",
            status: "",
            token: token,
        });
    }
});
module.exports = router;
