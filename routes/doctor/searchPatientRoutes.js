const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");
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

//patient new record form
router.post("/patient/form", async (req, res, next) => {
    const healthID = req.body.healthID;
    const patient = await User.findOne({ "accessID.healthID": healthID });
    res.render("doctor/newform", {
        doctor: req.user,
        fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        patient: patient,
    });
});

router.post("/patient/new", async (req, res, next) => {
    const {
        healthID,
        startDate,
        doctorName,
        doctorID,
        diseaseDesc,
        prescription,
        medicineName,
        time,
        response,
    } = req.body;
    try {
        const patient = await User.findOne({ "accessID.healthID": healthID });
        const doctor = await Doctor.findOne({ _id: doctorID });

        //save patient current treatment
        let medObj = {};
        medicineName.forEach((med, i) => {
            medObj[med] = time[i];
        });
        //funct to generate treatmentID also do in schema
        let currTreatObj = {
            history: diseaseDesc,
            labReports: "",
            doctor: doctor,
            prescriptions: prescription,
            medicines: medObj,
            response: response,
            startDate: startDate,
        };
        patient.currentTreatments.push(currTreatObj);
        const saved = await patient.save();
        if (!saved) {
            res.render("doctor/newform", {
                doctor: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                patient: patient,
            });
        }
        //doctor currentTreatments
    } catch (e) {
        console.log(e);
        const patient = await User.findOne({ "accessID.healthID": healthID });
        res.render("doctor/newform", {
            doctor: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            patient: patient,
        });
    }
});
module.exports = router;
