const router = require("express").Router();
const crypto = require("crypto");
const transporter = require("../utils/email.js");
const User = require("../models/user/User.js");
const Doctor = require("../models/doctor/Doctor.js");
const Lab = require("../models/lab/Lab.js");

//USER

//get changeemail page
router.get("/user/changeemail", (req, res, next) => {
    res.render("user/changeemail", { error: "", status: "" });
});
//submit email for link
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
            from: "Digital Health Record Portal<digitalhealthrecord1@gmail.com>",
            subject: "Change Email!",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>To change email click on the link below</h4>
                    <h6>If its not you the <b>don't click this link.</h6><br>
                    <a href="${process.env.HOST_URL}/doctor/new-email/${token}">this link</a>
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
                res.render("doctor/login", {
                    error: "",
                    status:
                        "Email Change link mailed to you on Register mail-Id",
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
    res.render("doctor/newemail", { error: "", status: "", token: token });
});

router.post("/user/new-email", async (req, res, next) => {
    const { token, email, cemail } = req.body;
    if (email !== cemail) {
        return res.render("user/newemail", {
            error: "Email not matched",
            status: "",
            token: token,
        });
    }
    try {
        const doctor = await User.findOne({ "account.resetToken": token });
        if (!doctor) {
            return res.render("user/newemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (doctor.account.resetTokenExpiration < Date.now()) {
            return res.render("user/newemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        doctor.account.email = email;
        doctor.account.resetToken = undefined;
        doctor.account.resetTokenExpiration = Date.now();
        const saved = await doctor.save();
        if (!saved) {
            return res.render("user/newemail", {
                error: "Cannot update Email at the moment",
                status: "",
                token: token,
            });
        }
        //if success , redirect doctor to login
        res.render("user/login", {
            error: "",
            status: "Your Email Updated successfull, now login",
        });
        //notify doctor about new password set
        const message = {
            to: doctor.account.email,
            from: "Digital Health Record Portal<digitalhealthrecord1@gmail.com>",
            subject: "New Email updated successfully",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>New email is registered with your account.</h4>
                    `,
        };
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    } catch (e) {
        console.log(e);
        res.render("user/newemail", {
            error: "Server Error",
            status: "",
            token: token,
        });
    }
});


//DOCTOR

//get changeemail page
router.get("/doctor/changeemail", (req, res, next) => {
    res.render("doctor/changeemail", { error: "", status: "" });
});
//submit email for link
router.post("/doctor/changeemail", async (req, res, next) => {
    const email = req.body.email;
    try {
        var validUser = await Doctor.findOne({ "account.email": email });
        if (!validUser) {
            return res.render("doctor/changeemail", {
                error: "Email not found",
                status: "",
            });
        }
        let token;
        buffer = await crypto.randomBytes(32);
        if (!buffer) {
            return res.render("doctor/changeemail", {
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
            from: "Digital Health Record Portal<digitalhealthrecord1@gmail.com>",
            subject: "Change Email!",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>To change email click on the link below</h4>
                    <h6>If its not you the <b>don't click this link.</h6><br>
                    <a href="${process.env.HOST_URL}/doctor/new-email/${token}">this link</a>
                    `,
        };
        //send link to change Email
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
                return res.render("doctor/changeemail", {
                    error: "Server Error",
                    status: "",
                });
            } else {
                console.log("Email sent successfully");
                res.render("doctor/login", {
                    error: "",
                    status:
                        "Email Change link mailed to you on Register mail-Id",
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.render("doctor/changeemail", {
            error: "Server Error",
            status: "",
        });
    }
});

router.get("/doctor/new-email/:token", (req, res, next) => {
    token = req.params.token;
    res.render("doctor/newemail", { error: "", status: "", token: token });
});

router.post("/doctor/new-email", async (req, res, next) => {
    const { token, email, cemail } = req.body;
    if (email !== cemail) {
        return res.render("doctor/newemail", {
            error: "Email not matched",
            status: "",
            token: token,
        });
    }
    try {
        const doctor = await Doctor.findOne({ "account.resetToken": token });
        if (!doctor) {
            return res.render("doctor/newemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (doctor.account.resetTokenExpiration < Date.now()) {
            return res.render("doctor/newemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        doctor.account.email = email;
        doctor.account.resetToken = undefined;
        doctor.account.resetTokenExpiration = Date.now();
        const saved = await doctor.save();
        if (!saved) {
            return res.render("doctor/newemail", {
                error: "Cannot update Email at the moment",
                status: "",
                token: token,
            });
        }
        //if success , redirect doctor to login
        res.render("doctor/login", {
            error: "",
            status: "Your Email Updated successfull, now login",
        });
        //notify doctor about new password set
        const message = {
            to: doctor.account.email,
            from: "Digital Health Record Portal<digitalhealthrecord1@gmail.com>",
            subject: "New Email updated successfully",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>New email is registered with your account.</h4>
                    `,
        };
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    } catch (e) {
        console.log(e);
        res.render("doctor/newemail", {
            error: "Server Error",
            status: "",
            token: token,
        });
    }
});

//lab

//get changeemail page
router.get("/labchangeemail", (req, res, next) => {
    res.render("lab/changeemail", { error: "", status: "" });
});
//submit email for link
router.post("/lab/changeemail", async (req, res, next) => {
    const email = req.body.email;
    try {
        var validUser = await Lab.findOne({ "account.email": email });
        if (!validUser) {
            return res.render("lab/changeemail", {
                error: "Email not found",
                status: "",
            });
        }
        let token;
        buffer = await crypto.randomBytes(32);
        if (!buffer) {
            return res.render("lab/changeemail", {
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
            from: "Digital Health Record Portal<digitalhealthrecord1@gmail.com>",
            subject: "Change Email!",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>To change email click on the link below</h4>
                    <h6>If its not you the <b>don't click this link.</h6><br>
                    <a href="${process.env.HOST_URL}/doctor/new-email/${token}">this link</a>
                    `,
        };
        //send link to change Email
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
                return res.render("lab/changeemail", {
                    error: "Server Error",
                    status: "",
                });
            } else {
                console.log("Email sent successfully");
                res.render("lab/login", {
                    error: "",
                    status:
                        "Email Change link mailed to you on Register mail-Id",
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.render("lab/changeemail", {
            error: "Server Error",
            status: "",
        });
    }
});

router.get("/lab/new-email/:token", (req, res, next) => {
    token = req.params.token;
    res.render("lab/newemail", { error: "", status: "", token: token });
});

router.post("/lab/new-email", async (req, res, next) => {
    const { token, email, cemail } = req.body;
    if (email !== cemail) {
        return res.render("lab/newemail", {
            error: "Email not matched",
            status: "",
            token: token,
        });
    }
    try {
        const doctor = await Lab.findOne({ "account.resetToken": token });
        if (!doctor) {
            return res.render("lab/newemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (doctor.account.resetTokenExpiration < Date.now()) {
            return res.render("lab/newemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        doctor.account.email = email;
        doctor.account.resetToken = undefined;
        doctor.account.resetTokenExpiration = Date.now();
        const saved = await doctor.save();
        if (!saved) {
            return res.render("lab/newemail", {
                error: "Cannot update Email at the moment",
                status: "",
                token: token,
            });
        }
        //if success , redirect doctor to login
        res.render("lab/login", {
            error: "",
            status: "Your Email Updated successfull, now login",
        });
        //notify doctor about new password set
        const message = {
            to: doctor.account.email,
            from: "Digital Health Record Portal<digitalhealthrecord1@gmail.com>",
            subject: "New Email updated successfully",
            html: `<body><h3 style={"text-align: center"}>Digital Health Record Portal</h3></body>
                    <h4>New email is registered with your account.</h4>
                    `,
        };
        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    } catch (e) {
        console.log(e);
        res.render("lab/newemail", {
            error: "Server Error",
            status: "",
            token: token,
        });
    }
});

module.exports = router;
