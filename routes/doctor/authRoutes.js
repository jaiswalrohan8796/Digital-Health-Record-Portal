const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const emailTemplate = require("../../utils/email.js")
const { check, validationResult } = require("express-validator");

const Doctor = require("../../models/doctor/Doctor.js");
require("../../utils/passportConfig.js");

//routes
router.post(
    "/login",
    passport.authenticate("Doctor-local", {
        successRedirect: "/doctor/dashboard",
        failureRedirect: "/doctor/login",
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
        // check("DOB")
        //     .notEmpty()
        //     .withMessage("Date of Birth is required")
        //     .isDate()
        //     .withMessage("Date of Birth should be a date"),
        // check("gender").notEmpty().withMessage("Gender is required"),
        // check("bloodGroup").notEmpty().withMessage("Blood Group is required"),
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
            designation,
            specialization,
            mcirno,
            email,
            mobileNo,
            // DOB,
            // gender,
            // bloodGroup,
            password,
            confirmPassword,
        } = req.body;
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.render("doctor/register", {
                    error: errors.array(),
                    status: "",
                });
            }
            const alreadyUser = await Doctor.findOne({
                "account.email": email,
            });
            if (alreadyUser) {
                return res.render("doctor/register", {
                    error: "Already a user, please login",
                    status: "",
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newDoctor = new Doctor({
                role: "doctor",
                profile: {
                    firstName: firstName,
                    lastName: lastName,
                    // DOB: DOB,
                    // gender: gender,
                    // bloodGroup: bloodGroup,
                    mobileNo: mobileNo,
                    address: address,
                    designation: designation,
                    specialization: specialization,
                    mcirno: mcirno,
                },
                account: {
                    email: email,
                    password: hashedPassword,
                },
            });
            const saved = newDoctor.save();
            if (!saved) {
                return res.render("doctor/register", {
                    error: "Unable to register",
                    status: "",
                });
            }
            console.log(saved);
            res.render("doctor/login", {
                error: "",
                status: "Success! Now Login",
            });
            emailTemplate
                .send({
                    template: "register",
                    message: {
                        from:
                            "Digital Health Record Portal <digitalhealthrecord1@gmail.com>",
                        to: email,
                    },
                    locals: {
                        fname: firstName,
                        lname: lastName,
                        dashboardLink: "${process.env.HOST_URL}/doctor/dashboard",
                    },
                })
                .then(() => console.log("email has been send!"))
                .catch((e) => console.log(e));
        } catch (e) {
            console.log(e);
            res.render("doctor/register", {
                error: "Unable to register",
                status: "",
            });
        }
    }
);

module.exports = router;
