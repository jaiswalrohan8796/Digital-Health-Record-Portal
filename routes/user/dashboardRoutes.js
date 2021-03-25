const router = require("express").Router();

const User = require("../../models/user/User.js");
router.get("/dashboard", async (req, res, next) => {
    res.render("user/home", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/current", async (req, res, next) => {
    res.render("user/currentTreatments", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/previous", async (req, res, next) => {
    res.render("user/previousTreatments", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/labreports", async (req, res, next) => {
    res.render("user/labReports", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/settings", async (req, res, next) => {
    res.render("user/settings", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
