const router = require("express").Router();
const User = require("../../models/user/User.js");
const Lab = require("../../models/lab/Lab.js");

//multer
const upload = require("../../utils/multerConfig.js");

//azure
const azure = require("../../utils/azureStorageConfig.js");

//search handler
router.post("/search", async (req, res, next) => {
    const searchQuery = Number(req.body.search);
    try {
        const searchedUser = await User.findOne({
            "accessID.healthID": searchQuery,
        });

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

//treatment specefic report form handler
router.post(
    "/treatment-report",
    upload.single("attachment"),
    async (req, res, next) => {
        try {
            const submitDate = new Date(req.body.submitDate);
            const testName = req.body.testName;
            const remark = req.body.remark;
            const healthID = Number(req.body.healthID);
            const treatmentNo = Number(req.body.treatmentNo);
            //labName
            const labName = req.user.profile.labName;
            //upload to azure & get blobName
            const blobName = await azure.upload(req.file.buffer, req);
            //lab report object
            const labReports = {
                labName: labName,
                submitDate: submitDate,
                testName: testName,
                treatmentNo: treatmentNo,
                attachment: blobName,
                remarks: remark,
            };
            //find patient & add report to specefic treatment
            const patient = await User.findOne({
                "accessID.healthID": healthID,
            });
            patient.currentTreatments.forEach((currTreat) => {
                if (currTreat.treatmentNo === treatmentNo) {
                    currTreat.labReports = labReports;
                }
            });
            patient.labReports.push(labReports);
            const patientDataSave = await patient.save();
            if (!patientDataSave) {
                return res.json({
                    mess: "Database Error,try again !",
                    status: false,
                });
            }
            //save to lab
            const labKalabReports = {
                submitDate: submitDate,
                patient: patient,
                treatmentNo: treatmentNo,
                testName: testName,
                attachment: blobName,
                remarks: remark,
            };
            //find lab
            const lab = await Lab.findOne({ _id: req.user._id });
            lab.sentReports.push(labKalabReports);
            const labDataSave = await lab.save();
            if (!labDataSave) {
                return res.json({
                    mess: "Database Error,try again !",
                    status: false,
                });
            }
            res.json({ mess: "Report Sent !", status: true });
        } catch (e) {
            console.log(e);
            return re.json({ mess: "Try again !", status: false });
        }
    }
);

//download report
router.get("/report/:attachment", async (req, res, next) => {
    const attachment = req.params.attachment;
    const pdfBuffer = await azure.download(attachment);
    res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename = ${attachment}`,
        "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
});

module.exports = router;
