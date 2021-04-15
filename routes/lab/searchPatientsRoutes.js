const router = require("express").Router();
const User = require("../../models/user/User.js");
const Lab = require("../../models/lab/Lab.js");
 

//search handler
router.post("/search", async (req, res, next) => {
    const searchQuery = Number(req.body.search);
    try {
        const searchedUser = await User.findOne({
            "accessID.healthID": searchQuery,
        })
            
        if (!searchedUser) {
            return res.render("lab/home", {
                lab: req.user,
                labName: `${req.user.profile.labName}`,
                searchStatus: "Patient not found !",
            });
        }
        return res.render("lab/patientDetails", {
            lab: req.user,
            labName: `${req.user.profile.labName}`,
            patient: searchedUser,
        });
    } catch (e) {
        console.log(e);
        res.render("lab/home", {
            lab: req.user,
            labName: `${req.user.profile.labName}`,
            searchStatus: "Server Error",
        });
    }
});
module.exports = router;