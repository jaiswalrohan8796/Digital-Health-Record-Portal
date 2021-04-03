const router = require("express").Router();
const crypto = require("crypto");
const transporter = require("../utils/email.js");
const User = require("../models/user/User.js");
const Doctor = require("../models/doctor/Doctor.js");
const Lab = require("../models/lab/Lab.js");
//USER

//get forgotpassword page
router.get("/user/changeemail", (req, res, next) => {
    res.render("user/changeemail", { error: "", status: "" });
});
//submitted email for link
router.post("/user/changeemail", async (req, res, next) => {
    const email = req.body.email;
    try {
        var validUser = await User.findOne({ "account.email": email });
        if (!validUser) {
            return res.render("user/changeemail", {
                error: "Email not found",
                status: "",
            });
        }
        let token;
        buffer = await crypto.randomBytes(32);
        if (!buffer) {
            return res.render("user/changeemail", {
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
        //send link to change Email
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
                return res.render("user/changeemail", {
                    error: "Server Error",
                    status: "",
                });
            } else {
                console.log("Email sent successfully");
                res.render("user/login", {
                    error: "",
                    status: "Email Change link mailed to you on Register mail-Id",
                });
            }

        });
    } catch (e) {
        console.log(e);
        res.render("user/changeemail", {
            error: "Server Error",
            status: "",
        });
    }
});

router.get("/user/new-email/:token", (req, res, next) => {
    token = req.params.token;
    res.render("user/changeemail", { error: "", status: "", token: token });
});

router.post("/user/new-email", async (req, res, next) => {
    const { token, email, cemail } = req.body;
    if (email !== cemail) {
        return res.render("user/changeemail", {
            error: "Email not matched",
            status: "",
            token: token,
        });
    }
    try {
        const Email = email;
        const user = await User.findOne({ "account.resetToken": token });
        if (!user) {
            return res.render("user/changeemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (user.account.resetTokenExpiration < Date.now()) {
            return res.render("user/changeemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        user.account.email = Email;
        user.account.resetToken = undefined;
        user.account.resetTokenExpiration = Date.now();
        const saved = await user.save();
        if (!saved) {
            return res.render("user/changeemail", {
                error: "Cannot update Email at the moment",
                status: "",
                token: token,
            });
        }
        //if success , redirect user to login
        res.render("user/login", {
            error: "",
            status: "Your Email Updated successfull, now login",
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
        res.render("user/changeemail", {
            error: "Server Error",
            status: "",
            token: token,
        });
    }
});

module.exports = router;
