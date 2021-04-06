const router = require("express").Router();
const { check, validationResult } = require("express-validator");

const Lab = require("../../models/lab/Lab.js");

router.post(
    "/settings/profile",
    [
        check("labName")
            .isLength({ min: 2 })
            .withMessage("Lab Name must have atleast two alphabets")
            .trim(),
        check("registrationNo")
            .isLength({ min: 1 })
            .withMessage("Registration number must have atleast two alphabets")
            .trim(),
        check("phoneNo")
            .isLength({ min: 6, max: 10 })
            .withMessage(
                "Phone number must have atleast 6 and maximum 10 alphabets"
            )
            .trim(),
        check("address")
            .isLength({ min: 2 })
            .withMessage("Address must have atleast two alphabets"),
        check("state")
            .isLength({ min: 2 })
            .withMessage("State must have atleast two alphabets")
            .trim(),
        check("city")
            .isLength({ min: 2 })
            .withMessage("City must have atleast two alphabets")
            .trim(),
        check("pincode")
            .isNumeric()
            .withMessage("Pincode should be a number")
            .isLength({ min: 6, max: 6 })
            .withMessage("Pincode should be a six digit number")
            .trim(),
    ],
    async (req, res, next) => {
        var {
            id,
            labName,
            registrationNo,
            phoneNo,
            address,
            state,
            city,
            pincode,
        } = req.body;
        try {
            var user = await Lab.findOne({ _id: id });
            if (!user) {
                return res.render("lab/settings", {
                    user: req.user,
                    labName: `${req.lab.profile.labName}`,
                    status: "User not found",
                    error: "",
                });
            }
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("lab/settings", {
                    user: user,
                    labName: `${lab.profile.labName}`,
                    status: "",
                    error: errors.array(),
                });
            }
            DOB = new Date(DOB);
            lab.profile = {
                labName,
                registrationNo,
                phoneNo,
                address,
                state,
                city,
                pincode,
            };
            const result = await lab.save();
            if (!result) {
                res.render("lab/settings", {
                    user: lab,
                    labName: `${lab.profile.labName}`,
                    status: "",
                    error: "Cannot update now,try later",
                });
            }
            res.render("lab/settings", {
                user: user,
                labName: `${lab.profile.labName}`,
                status: "Changes saved !",
                error: "",
            });
        } catch (e) {
            console.log(e);
            res.render("lab/settings", {
                user: user,
                labName: `${lab.profile.labName}`,
                status: "",
                error: "Server Error",
            });
        }
    }
);

module.exports = router;
