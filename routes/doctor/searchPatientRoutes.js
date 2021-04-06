const router = require("express").Router();

const User = require("../../models/user/User.js");

//search handler
router.post("/search", async (req, res, next) => {
    const searchQuery = Number(req.body.search);
    try {
        const searchedUser = await User.findOne({
            "accessID.healthID": searchQuery,
        });
        if (!searchedUser) {
            return res.render("doctor/home", {
                doctor: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                searchStatus: "Patient not found !",
            });
        }
        return res.render("doctor/patientDetail", {
            doctor: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            patient: searchedUser,
        });
    } catch (e) {
        console.log(e);
        res.render("doctor/home", {
            doctor: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            searchStatus: "Server Error",
        });
    }
});

module.exports = router;
