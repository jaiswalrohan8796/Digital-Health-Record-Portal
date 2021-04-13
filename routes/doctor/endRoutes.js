const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");

router.post("/current/patient-end", async (req, res, next) => {
    var { healthID, treatmentNo } = req.query;
    treatmentNo = Number(treatmentNo);
    //doctor side end
    const doctor = await Doctor.findOne({ _id: req.user._id });
    //store this treatment for pushing in prev
    var tempTreatment = doctor.currentPatients.find((currPat) => {
        return (currPat.treatmentNo = treatmentNo);
    });
    //formattin the curr treat list
    var newCurrentPatientList = doctor.currentPatients.filter((currPat) => {
        return currPat.treatmentNo !== treatmentNo;
    });
    console.log(newCurrentPatientList);

    doctor.currentPatients = newCurrentPatientList;

    const result = await doctor.save();
    if (!result) {
        res.json({ status: false });
    }
    console.log(tempTreatment);
    res.json({ status: true });
});

module.exports = router;
