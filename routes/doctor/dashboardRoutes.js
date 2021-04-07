const router = require("express").Router();
const Doctor = require("../../models/doctor/Doctor.js");
const searchPatientRoutes = require("../doctor/searchPatientRoutes.js")
const settingRoutes = require("../doctor/settingRoutes.js");



//dashboard menu routes
router.get("/dashboard", (req, res, next) => {
    res.render("doctor/home", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        searchStatus:null
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
        status: "Edit to update ",
        error: "",
    });
});



//imported routes


//settings routes
router.use("/dashboard", settingRoutes);


//search patient routes  
router.use("/dashboard",searchPatientRoutes)



//logout
router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
