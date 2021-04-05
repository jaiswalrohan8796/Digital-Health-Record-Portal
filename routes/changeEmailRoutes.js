const router = require("express").Router();
const crypto = require("crypto");
const emailTemplate = require("../utils/email.js");
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
        res.render("user/login", {
            error: "",
            status: "Check your mail for link",
        });
        emailTemplate
            .send({
                template: "resetemail",
                message: {
                    from:
                        "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                    to:email,
                },
                locals: {
                    fname: `${validUser.profile.firstName} ${validUser.profile.lastName}`,
                    changeEmailLink: `${process.env.HOST_URL}/user/new-email/${token}`,
                },
            })
            .then(() => console.log("email has been send!"))
            .catch((e) => console.log(e));
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
    res.render("user/newemail", { error: "", status: "", token: token });
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
        const user = await User.findOne({ "account.resetToken": token });
        if (!user) {
            return res.render("user/newemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (user.account.resetTokenExpiration < Date.now()) {
            return res.render("user/newemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        user.account.email = email;
        user.account.resetToken = undefined;
        user.account.resetTokenExpiration = Date.now();
        const saved = await user.save();
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
        emailTemplate
            .send({
                template: "emailchanged",
                message: {
                    from:
                        "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                    to: user.account.email,
                },
                locals: {
                    fname: `${user.profile.firstName} ${user.profile.lastName}`,
                    dashboardLink: `${process.env.HOST_URL}/user/dashboard`,
                },
            })
            .then(() => console.log("email has been send!"))
            .catch((e) => console.log(e));
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
        res.render("doctor/login", {
            error: "",
            status: "Check your mail for link",
        });
        emailTemplate
            .send({
                template: "resetemail",
                message: {
                    from:
                        "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                    to: email,
                },
                locals: {
                    fname: `${validUser.profile.firstName} ${validUser.profile.lastName}`,
                    changeEmailLink: `${process.env.HOST_URL}/doctor/new-email/${token}`,
                },
            })
            .then(() => console.log("email has been send!"))
            .catch((e) => console.log(e));
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
        const validUser = await Doctor.findOne({ "account.resetToken": token });
        if (!validUser) {
            return res.render("doctor/newemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (validUser.account.resetTokenExpiration < Date.now()) {
            return res.render("doctor/newemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        validUser.account.email = email;
        validUser.account.resetToken = undefined;
        validUser.account.resetTokenExpiration = Date.now();
        const saved = await validUser.save();
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
        //notify doctor about new email set
        emailTemplate
            .send({
                template: "emailchanged",
                message: {
                    from:
                        "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                    to: email,
                },
                locals: {
                    fname: `${validUser.profile.firstName} ${validUser.profile.lastName}`,
                    dashboardLink: `${process.env.HOST_URL}/doctor/dashboard`,
                },
            })
            .then(() => console.log("email has been send!"))
            .catch((e) => console.log(e));
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
        res.render("lab/login", {
            error: "",
            status: "Check your mail for link",
        });
        emailTemplate
            .send({
                template: "resetemail",
                message: {
                    from:
                        "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                    to: email,
                },
                locals: {
                    fname: `${validUser.profile.labName}`,
                    changeEmailLink: `${process.env.HOST_URL}/lab/new-email/${token}`,
                },
            })
            .then(() => console.log("email has been send!"))
            .catch((e) => console.log(e));
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
        const user = await Lab.findOne({ "account.resetToken": token });
        if (!user) {
            return res.render("lab/newemail", {
                error: "Token not found",
                status: "",
                token: token,
            });
        }
        if (user.account.resetTokenExpiration < Date.now()) {
            return res.render("lab/newemail", {
                error: "Token expired",
                status: "",
                token: token,
            });
        }
        user.account.email = email;
        user.account.resetToken = undefined;
        user.account.resetTokenExpiration = Date.now();
        const saved = await user.save();
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
        //notify doctor about new email set
        emailTemplate
            .send({
                template: "emailchanged",
                message: {
                    from:
                        "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                    to: email,
                },
                locals: {
                    fname: `${user.profile.labName}`,
                    dashboardLink: `${process.env.HOST_URL}/lab/dashboard`,
                },
            })
            .then(() => console.log("email has been send!"))
            .catch((e) => console.log(e));
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
