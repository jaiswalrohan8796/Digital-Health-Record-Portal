const router = require("express").Router();
const Lab = require("../../models/lab/Lab.js");
const labSettingRoutes=require("../lab/labSettingsRoutes.js")

router.get("/dashboard", async (req, res, next) => {
    res.render("lab/home", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
    });
});
router.get("/dashboard/sent", async (req, res, next) => {
    res.render("lab/sentReports", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
    });
});
router.get("/dashboard/pending", async (req, res, next) => {
    res.render("lab/pendingReports", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
    });
});
router.get("/dashboard/settings", async (req, res, next) => {
    res.render("lab/settings", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
        status: "Edit to update ",
        error: "",
    });
});

//imported routes
router.use("/dashboard",labSettingRoutes);

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
