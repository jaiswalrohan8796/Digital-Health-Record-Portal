const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");

router.post("/current/patient-end", async (req, res, next) => {
    var { healthID, treatmentNo } = req.query;
    treatmentNo = Number(treatmentNo);
    healthID = Number(healthID);
    //doctor side end handling =>

    const doctor = await Doctor.findOne({ _id: req.user._id }).populate(
        "currentPatients.patient"
    );
    //store this treatment for pushing in prev
    var tempTreatment = doctor.currentPatients.find((currPat) => {
        return currPat.treatmentNo === treatmentNo;
    });
    //formatting the curr pat list
    var newCurrentPatientList = doctor.currentPatients.filter((currPat) => {
        return currPat.treatmentNo !== treatmentNo;
    });
    doctor.currentPatients = newCurrentPatientList;
    //add endDate to temporaryTreatment to be appended to prev
    tempTreatment.endDate = Date.now();
    //pushing this to prev treat
    doctor.previousPatients.push(tempTreatment);
    //updating the curr treat & prev treat list
    const result = await doctor.save();
    if (!result) {
        return res.json({ status: false });
    }
    res.json({ status: true });

    //patient side end handling =>
    const patient = await User.findOne({
        "accessID.healthID": healthID,
    }).populate("currentTreatments.doctor");

    //save temporaryTreatment to push in prev
    var tempTreatment2 = patient.currentTreatments.find((currTreat) => {
        return currTreat.treatmentNo === treatmentNo;
    });
    //formatting the curr treat list
    var newCurrentTreatmentsList = patient.currentTreatments.filter(
        (currTreat) => {
            return currTreat.treatmentNo !== treatmentNo;
        }
    );
    //updating the currentTreatments list
    patient.currentTreatments = newCurrentTreatmentsList;
    // adding endDate to treatment to be pushed in prev list
    tempTreatment2.endDate = Date.now();
    //pushing it in prev treat list
    patient.previousTreatments.push(tempTreatment2);

    const saved2 = await patient.save();
});

module.exports = router;
