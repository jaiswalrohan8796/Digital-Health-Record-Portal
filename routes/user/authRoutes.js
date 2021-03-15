const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../../models/user/User.js");
require("../../utils/user/passportConfig.js");

//routes
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/user/dashboard",
        failureRedirect: "/user/login",
        failureFlash: true,
    })
);

router.post(
    "/register",
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
        check("pincode")
            .isNumeric()
            .withMessage("Pincode should be a number")
            .isLength({ min: 6, max: 6 })
            .withMessage("Pincode should be a six digit number")
            .trim(),
        check("email")
            .notEmpty()
            .withMessage("Email should not be empty ")
            .isEmail()
            .withMessage("Email should be valid")
            .trim()
            .normalizeEmail(),
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
        check("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 3 })
            .withMessage("Password should be atleast 3 characters long")
            .trim(),
        check("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error("Password not matched");
            }
            return true;
        }),
    ],
    async (req, res, next) => {
        const {
            firstName,
            lastName,
            address,
            state,
            city,
            pincode,
            email,
            mobileNo,
            DOB,
            gender,
            bloodGroup,
            password,
            confirmPassword,
        } = req.body;
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.render("user/register", {
                    error: errors.array(),
                    status: "",
                });
            }
            const alreadyUser = await User.findOne({ "account.email": email });
            if (alreadyUser) {
                return res.render("user/register", {
                    error: "Already a user, please login",
                    status: "",
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                role: "user",
                profile: {
                    firstName: firstName,
                    lastName: lastName,
                    DOB: DOB,
                    gender: gender,
                    bloodGroup: bloodGroup,
                    mobileNo: mobileNo,
                    address: address,
                    state: state,
                    city: city,
                    pincode: pincode,
                },
                account: {
                    email: email,
                    password: hashedPassword,
                },
            });
            const saved = newUser.save();
            if (!saved) {
                return res.render("user/register", {
                    error: "Unable to register",
                    status: "",
                });
            }
            console.log(saved);
            return res.render("user/login", {
                error: "",
                status: "Success! Now Login",
            });
        } catch (e) {
            console.log(e);
            res.render("user/register", {
                error: "Unable to register",
                status: "",
            });
        }
    }
);

module.exports = router;
