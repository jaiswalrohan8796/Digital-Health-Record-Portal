const router = require("express").Router();
const User = require("../../models/user/User.js");
const Doctor = require("../../models/doctor/Doctor.js");
const generateUniqueId = require("generate-unique-id");

//search handler
router.post("/search", async (req, res, next) => {
    const searchQuery = Number(req.body.search);
    try {
        const searchedUser = await User.findOne({
            "accessID.healthID": searchQuery,
        })
            .populate("currentTreatments.doctor")
            .populate("previousTreatments.doctor");
        if (!searchedUser) {
            return res.render("doctor/home", {
                doctor: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                searchStatus: "Patient not found !",
            });
        }
        //sort all parameters of patient by date desc
        searchedUser.currentTreatments.sort((a, b) => {
            return b.startDate - a.startDate;
        })
        searchedUser.previousTreatments.sort((a, b) => {
            return b.endDate - a.endDate;
        })
        searchedUser.labReports.sort((a, b) => {
            return b.submitDate - a.submitDate;
        })
        
        return res.render("doctor/patientDetail", {
            doctor: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            patient: searchedUser,
            status:null,
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

//patient new record form post
router.post("/patient/new", async (req, res, next) => {
    var {
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
    if (!startDate) {
        startDate = new Date();
    }
    try {
        const patient = await User.findOne({ "accessID.healthID": healthID })
            .populate("currentTreatments.doctor")
            .populate("previousTreatments.doctor");
        const doctor = await Doctor.findOne({ _id: doctorID });
        let medArray = [];
        let timeArray = [];
        if (!(medicineName instanceof Array)) {
            medArray = [medicineName];
            timeArray = [time];
        } else {
            medArray = [...medicineName];
            timeArray = [...time];
        }
        let medObj = {
            name: medArray,
            time: timeArray,
        };
        const alltreatmentNoObject = await User.find(
            {},
            { previousTreatments: 1 }
        );

        //converted to list
        const alltreatmentNoList = alltreatmentNoObject.map(
            (obj) => obj.treatmentNo
        );

        //Generate Treatment Number
        var treatmentNo = await generateUniqueId({
            length: 4,
            useLetters: false,
            useNumbers: true,
            excludeSymbols: ["!", "@", "#", "$", "%", "&", "*", "~", "^"],
        });

        //check if exist
        const alreadytreatmentNo = alltreatmentNoList.includes(treatmentNo);
        if (alreadytreatmentNo) {
            //regenerate
            treatmentNo = generateUniqueId({
                length: 3,
                useLetters: false,
                useNumbe: true,
                excludeSymbols: ["!", "@", "#", "$", "%", "&", "*", "~", "^"],
            });
        }
        let currTreatObj = {
            healthID: healthID,
            treatmentNo: treatmentNo,
            doctorName: doctorName,
            history: diseaseDesc,
            labReports: "",
            doctor: doctor,
            prescriptions: prescription,
            medicines: medObj,
            response: response,
            startDate: startDate,
        };
        let currPatObj = {
            healthID: healthID,
            treatmentNo: treatmentNo,
            doctorName: doctorName,
            history: diseaseDesc,
            labReports: "",
            patient: patient,
            prescriptions: prescription,
            medicines: medObj,
            response: response,
            startDate: startDate,
        };
        patient.currentTreatments.push(currTreatObj);
        const saved = await patient.save();
        if (!saved) {
            return res.render("doctor/newform", {
                doctor: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                patient: patient,
            });
        }
        //doctor currentTreatments

        //current patients push
        doctor.currentPatients.push(currPatObj);
        const saved2 = await doctor.save();
        if (!saved2) {
            return res.render("doctor/newform", {
                doctor: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                patient: patient,
            });
        }
        res.render("doctor/patientDetail", {
            doctor: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            patient: patient,
            status:`Treatment No : ${treatmentNo} added`
        });
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
