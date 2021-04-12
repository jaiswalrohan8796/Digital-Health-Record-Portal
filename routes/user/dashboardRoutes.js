const router = require("express").Router();
const User = require("../../models/user/User.js");
const settingRoutes = require("../user/settingRoutes.js");
 

//dashboard home
router.get("/dashboard", async (req, res, next) => {
    const medformfilled = req.user.medical.filled
    res.render("user/home", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        medform: !medformfilled,
        status: null,
    });
});

//current treatments
router.get("/dashboard/current", async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).populate(
        "currentTreatments.doctor"
    );
 
    res.render("user/currentTreatments", {
        user: user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});


//previous treatments
router.get("/dashboard/previous", async (req, res, next) => {
    res.render("user/previousTreatments", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});

//lab reports
router.get("/dashboard/labreports", async (req, res, next) => {
    res.render("user/labReports", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    });
});

//medical detail form
router.get("/dashboard/medicaldetailform", async (req, res, next) => {
    res.render("user/medicalDetailForm", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        error: null,
    });
});

//medical detail form handler

router.post("/dashboard/medicaldetailform", async (req, res, next) => {
    var {
        id,
        medicalDiagnosis,
        allergies,
        functionalStatus,
        equipmentDevice,
    } = req.body;
    allergies = allergies.split(",");
    try {
        var user = await User.findOne({ _id: id });
        if (!user) {
            return res.render("user/medicalDetailForm", {
                user: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                error: "User not found",
            });
        }
        user.medical = {
            filled: true,
            medicalDiagnosis,
            allergies,
            functionalStatus,
            equipmentDevice,
        };
        const result = await user.save();
        if (!result) {
            return res.render("user/medicalDetailForm", {
                user: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                error: "Server Error",
            });
        }
        res.render("user/home", {
            user: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            medform: false,
            status: "Medical details saved",
        });
    } catch (e) {
        return res.render("user/medicalDetailForm", {
            user: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            error: "Server Error",
        });
    }
});

router.get("/dashboard/settings", async (req, res, next) => {
    res.render("user/settings", {
        user: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        status: "Edit to update ",
        error: "",
    });
});

//imported routes
router.use("/dashboard", settingRoutes);

// logout
router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
