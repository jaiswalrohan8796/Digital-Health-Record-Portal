const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");
const searchPatientRoutes = require("../doctor/searchPatientRoutes.js");
const settingRoutes = require("../doctor/settingRoutes.js");
const endRoutes = require("../doctor/endRoutes.js");

//dashboard menu routes
router.get("/dashboard", (req, res, next) => {
    res.render("doctor/home", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        searchStatus: null,
    });
});
router.get("/dashboard/current", async (req, res, next) => {
    const doctor = await Doctor.findOne({ _id: req.user._id }).populate(
        "currentPatients.patient"
    );
    res.render("doctor/currentPatients", {
        doctor: doctor,
        fullName: `${doctor.profile.firstName} ${doctor.profile.lastName}`,
    });
});
router.get("/dashboard/previous", async (req, res, next) => {
    const doctor = await Doctor.findOne({ _id: req.user._id }).populate(
        "previousPatients.patient"
    );
    res.render("doctor/previousPatients", {
        doctor: doctor,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/settings", (req, res, next) => {
    res.render("doctor/settings", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        status: "Edit to update ",
        error: "",
    });
});

//imported routes

//settings routes
router.use("/dashboard", settingRoutes);

//search patient routes
router.use("/dashboard", searchPatientRoutes);
router.use("/dashboard", endRoutes);

//logout
router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;

