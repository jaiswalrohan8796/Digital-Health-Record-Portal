const router = require("express").Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/user/User.js");

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
        check("state")
            .isLength({ min: 2 })
            .withMessage("State must have atleast two alphabets")
            .trim(),
        check("city")
            .isLength({ min: 2 })
            .withMessage("City must have atleast two alphabets")
            .trim(),
        check("mobileNo")
            .isLength({ min: 10, max: 10 })
            .withMessage("Mobile number should be ten digit number")
            .isNumeric()
            .withMessage("Mobile number should contain only numerics"),
        check("DOB").notEmpty().withMessage("Date of Birth is required"),
        check("gender").notEmpty().withMessage("Gender is required"),
        check("bloodGroup").notEmpty().withMessage("Blood Group is required"),
    ],
    async (req, res, next) => {
        var {
            id,
            firstName,
            lastName,
            address,
            state,
            city,
            mobileNo,
            DOB,
            gender,
            bloodGroup,
        } = req.body;
        try {
            var user = await User.findOne({ _id: id });
            if (!user) {
                return res.render("user/settings", {
                    user: req.user,
                    fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                    status: "User not found",
                    error: "",
                });
            }
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("user/settings", {
                    user: user,
                    fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                    status: "",
                    error: errors.array(),
                });
            }
            DOB = new Date(DOB);
            user.profile = {
                firstName,
                lastName,
                address,
                state,
                city,
                mobileNo,
                DOB,
                gender,
                bloodGroup,
            };
            const result = await user.save();
            if (!result) {
                res.render("user/settings", {
                    user: user,
                    fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                    status: "",
                    error: "Cannot update now,try later",
                });
            }
            res.render("user/settings", {
                user: user,
                fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                status: "Changes saved !",
                error: "",
            });
        } catch (e) {
            console.log(e);
            res.render("user/settings", {
                user: user,
                fullName: `${user.profile.firstName} ${user.profile.lastName}`,
                status: "",
                error: "Server Error",
            });
        }
    }
);

router.post("/settings/medical", async (req, res, next) => {
    var {
        id,
        medicalDiagnosis,
        allergies,
        functionalStatus,
        equipmentDevice,
    } = req.body;
    allergies = allergies.split(",");
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.render("user/settings", {
                user: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                status: "User not found",
                error: "",
            });
        }
        user.medical = {
            filled: true,
            medicalDiagnosis,
            allergies,
            functionalStatus,
            equipmentDevice,
        };
        const result = await user.save();
        if (!result) {
            return res.render("user/settings", {
                user: req.user,
                fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
                status: "Server Error",
                error: "",
            });
        }
        res.render("user/settings", {
            user: user,
            fullName: `${user.profile.firstName} ${user.profile.lastName}`,
            status: "Changes saved !",
            error: "",
        });
    } catch (e) {
        console.log(e);
        res.render("user/settings", {
            user: req.user,
            fullName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
            status: "Server Error",
            error: "",
        });
    }
});

module.exports = router;
