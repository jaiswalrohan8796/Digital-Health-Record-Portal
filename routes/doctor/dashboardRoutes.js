const router = require("express").Router();

const Doctor = require("../../models/doctor/Doctor.js");
router.get("/dashboard", async (req, res, next) => {
    res.render("doctor/home", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
