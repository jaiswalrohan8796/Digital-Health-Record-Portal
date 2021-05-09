const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");

router.get("/chat", async (req, res, next) => {
    const doctor = await Doctor.findOne({ _id: req.user._id }).populate(
        "currentPatients.patient"
    );
    res.render("doctor/chatMenu", { doctor: doctor });
});

router.get("/chat/:id/:treatmentNo", async (req, res, next) => {
    const ID = req.params.id;
    const treatmentNo = req.params.treatmentNo;
    try {
        const patient = await User.findOne({ _id: ID });
        const doctor = req.user;
        res.render("doctor/chat", {
            doctor: doctor,
            patient: patient,
            treatmentNo: treatmentNo,
        });
    } catch (e) {
        console.log(e);
        const doctor = await Doctor.findOne({ _id: req.user._id }).populate(
            "currentPatients.patient"
        );
        res.render("doctor/chatMenu", { doctor: doctor });
    }
});
module.exports = router;
