const router = require("express").Router();

const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");

router.get("/chat", async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).populate(
        "currentTreatments.doctor"
    );
    //sort by date desc
    user.currentTreatments.sort((a, b) => {
        return b.startDate - a.startDate;
    });
    res.render("user/chatMenu", {
        user: user,
    });
});

router.get("/chat/:ID/:treatmentNo", async (req, res, next) => {
    const treatmentNo = Number(req.params.treatmentNo);
    try {
        const user = await User.findOne({ _id: req.user._id }).populate(
            "currentTreatments.doctor"
        );
        const chatWalaTreatment = user.currentTreatments.find((ct) => {
            return ct.treatmentNo === treatmentNo;
        });
        res.render("user/chat", {
            user: user,
            currentTreatment: chatWalaTreatment,
        });
    } catch (e) {
        console.log(e);
        const user = await User.findOne({ _id: req.user._id }).populate(
            "currentTreatments.doctor"
        );
        res.render("user/chatMenu", {
            user: user,
        });
    }
});

module.exports = router;
