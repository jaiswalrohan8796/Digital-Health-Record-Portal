const router = require("express").Router();

const Doctor = require("../../models/doctor/Doctor.js");
router.get("/dashboard", (req, res, next) => {
    res.render("doctor/home", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/current", (req, res, next) => {
    res.render("doctor/currentPatients", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/previous", (req, res, next) => {
    res.render("doctor/previousPatients", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/settings", (req, res, next) => {
    res.render("doctor/settings", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
