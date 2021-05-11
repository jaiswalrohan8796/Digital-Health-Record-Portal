const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");
const searchPatientRoutes = require("../doctor/searchPatientRoutes.js");
const settingRoutes = require("../doctor/settingRoutes.js");
const endRoutes = require("../doctor/endRoutes.js");
const chatRoutes = require("../doctor/chatRoutes.js");
const azure = require("../../utils/azureStorageConfig.js");

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
    //sort by date desc
    doctor.currentPatients.sort((a, b) => {
        return b.startDate - a.startDate;
    });
    res.render("doctor/currentPatients", {
        doctor: doctor,
        fullName: `${doctor.profile.firstName} ${doctor.profile.lastName}`,
    });
});
router.get("/dashboard/previous", async (req, res, next) => {
    const doctor = await Doctor.findOne({ _id: req.user._id }).populate(
        "previousPatients.patient"
    );
    //sort by date desc
    doctor.previousPatients.sort((a, b) => {
        return b.endDate - a.endDate;
    });
    res.render("doctor/previousPatients", {
        doctor: doctor,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});
router.get("/dashboard/settings", (req, res, next) => {
    res.render("doctor/settings", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        status: "Edit & save changes",
        error: "",
    });
});

//imported routes
//download report route
router.get("/dashboard/report/:attachment", async (req, res, next) => {
    const attachment = req.params.attachment;
    try {
        const pdfBuffer = await azure.download(attachment);
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename = ${attachment}`,
            "Content-Length": pdfBuffer.length,
        });
        res.end(pdfBuffer);
    } catch (e) {
        console.log(e);
        res.status(404).render("404");
    }
});

//settings routes
router.use("/dashboard", settingRoutes);

//search patient routes
router.use("/dashboard", searchPatientRoutes);
router.use("/dashboard", endRoutes);
router.use("/dashboard", chatRoutes);
//logout
router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
