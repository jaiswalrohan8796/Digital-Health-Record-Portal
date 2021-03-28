const router = require("express").Router();
const { check, validationResult } = require("express-validator");

const Doctor = require("../../models/doctor/Doctor.js");

router.post(
    "/settings/profile",
    [
        check("firstName")
            .isLength({ min: 2 })
            .withMessage("Name must have atleast two alphabets")
            .trim(),
        check("lastName")
            .isLength({ min: 2 })
            .withMessage("Name must have atleast two alphabets")
            .trim(),
        check("address")
            .isLength({ min: 2 })
            .withMessage("Address must have atleast two alphabets"),
        check("designation")
            .isLength({ min: 2 })
            .withMessage("Designation must have atleast two alphabets")
            .trim(),
        check("specialization")
            .isLength({ min: 2 })
            .withMessage("City must have atleast two alphabets")
            .trim(),
        check("mcirno")
            .isNumeric()
            .withMessage("mcir should be a number")
            .isLength({ min: 6, max: 6 })
            .withMessage("MCIR number should be 6 digit")
            .trim(),
        check("mobileNo")
            .isLength({ min: 10, max: 10 })
            .withMessage("Mobile number should be ten digit number")
            .isNumeric()
            .withMessage("Mobile number should contain only numerics"),
    ],
    async (req, res, next) => {
        const {
            id,
            firstName,
            lastName,
            designation,
            specialization,
            mcirno,
            mobileNo,
            address,
        } = req.body;
        try {
            var user = await Doctor.findOne({ _id: id });
            if (!user) {
                res.render("doctor/settings", {
                    doctor: user,
                    fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                    status: "User not found",
                    error: "",
                });
            }
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("doctor/settings", {
                    doctor: user,
                    fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                    status: "",
                    error: errors.array(),
                });
            }
            user.profile = {
                firstName,
                lastName,
                designation,
                specialization,
                mcirno,
                mobileNo,
                address,
            };
            const result = await user.save();
            if (!result) {
                res.render("doctor/settings", {
                    doctor: user,
                    fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                    status: "",
                    error: "Cannot update now,try later",
                });
            }
            res.render("doctor/settings", {
                doctor: user,
                fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                status: "Changes saved !",
                error: "",
            });
        } catch (e) {
            console.log(e);
            res.render("doctor/settings", {
                doctor: user,
                fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                status: "",
                error: "Server Error",
            });
        }
    }
);

module.exports = router;
