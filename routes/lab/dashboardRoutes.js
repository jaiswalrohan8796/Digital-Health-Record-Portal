const router = require("express").Router();
const Lab = require("../../models/lab/Lab.js");
const searchPatientsRoutes = require("../lab/searchPatientsRoutes.js");
const labSettingRoutes = require("../lab/labSettingsRoutes.js");

router.get("/dashboard", async (req, res, next) => {
    res.render("lab/home", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
    });
});
router.get("/dashboard/sent", async (req, res, next) => {
    const lab = await Lab.findOne({ _id: req.user._id }).populate(
        "sentReports.patient"
    );
    //sort by date desc
    lab.sentReports.sort((a, b) => {
        return b.submitDate - a.submitDate;
    });
    res.render("lab/sentReports", {
        lab: lab,
        labName: lab.profile.labName,
    });
});


// settings
router.get("/dashboard/settings", async (req, res, next) => {
    res.render("lab/settings", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
        status: "Edit & save changes",
        error: "",
    });
});

//imported routes
router.use("/dashboard", labSettingRoutes);
router.use("/dashboard", searchPatientsRoutes);

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
