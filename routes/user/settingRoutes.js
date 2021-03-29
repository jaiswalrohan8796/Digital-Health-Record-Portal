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
        check("DOB")
            .notEmpty()
            .withMessage("Date of Birth is required")
            .isDate()
            .withMessage("Date of Birth should be a date"),
        check("gender").notEmpty().withMessage("Gender is required"),
        check("bloodGroup").notEmpty().withMessage("Blood Group is required"),
    ],
    async (req, res, next) => {
        const {
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
                res.render("user/settings", {
                    user: user,
                    fullName: `${user.profile.firstName} ${user.profile.lastName}`,
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

module.exports = router;
