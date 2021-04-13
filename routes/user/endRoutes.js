const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");

router.post("/current/patient-end", async (req, res, next) => {
    var { doctorID, treatmentNo } = req.query;
    treatmentNo = Number(treatmentNo);
    //user side end handling =>
    const patient = await User.findOne({ _id: req.user._id }).populate(
        "currentTreatments.doctor"
    );
    //save temp treatment to be pushed in prev
    var tempTreatment = patient.currentTreatments.find((currTreat) => {
        return currTreat.treatmentNo === treatmentNo;
    });
    var newCurrentTreatmentsList = patient.currentTreatments.filter(
        (currTreat) => {
            return currTreat.treatmentNo !== treatmentNo;
        }
    );
    //updating the currentTreatments list
    patient.currentTreatments = newCurrentTreatmentsList;
    // adding endDate to treatment to be pushed in prev list
    tempTreatment.endDate = Date.now();
    //pushing it in prev treat list
    patient.previousTreatments.push(tempTreatment);
    const saved = await patient.save();
    if (!saved) {
        return res.json({ status: false });
    }
    res.json({ status: true });

    //doctor side end handling =>
    const doctor = await Doctor.findOne({ _id: doctorID }).populate(
        "currentPatients.patient"
    );
    //store this treatment for pushing in prev
    var tempTreatment2 = doctor.currentPatients.find((currPat) => {
        return currPat.treatmentNo === treatmentNo;
    });
    //formatting the curr pat list
    var newCurrentPatientList = doctor.currentPatients.filter((currPat) => {
        return currPat.treatmentNo !== treatmentNo;
    });
    doctor.currentPatients = newCurrentPatientList;
    //add endDate to temporaryTreatment to be appended to prev
    tempTreatment2.endDate = Date.now();
    //pushing this to prev treat
    doctor.previousPatients.push(tempTreatment2);
    const saved2 = await doctor.save();
});

module.exports = router;
