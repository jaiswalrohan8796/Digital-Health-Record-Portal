const router = require("express").Router();
const passport = require("passport");
const emailTemplate = require("../../utils/email.js");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const Lab = require("../../models/lab/Lab.js");
require("../../utils/passportConfig.js");

//routes
router.post(
    "/login",
    passport.authenticate("lab-local", {
        successRedirect: "/lab/dashboard",
        failureRedirect: "/lab/login",
        failureFlash: true,
    })
);

router.post(
    "/register",
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
        check("email")
            .notEmpty()
            .withMessage("Email should not be empty ")
            .isEmail()
            .withMessage("Email should be valid")
            .trim()
            .normalizeEmail(),
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
            labName,
            registrationNo,
            phoneNo,
            address,
            state,
            city,
            pincode,
            email,
            password,
            confirmPassword,
        } = req.body;
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("lab/register", {
                    error: errors.array(),
                    status: "",
                });
            }
            const alreadyUser = await Lab.findOne({ "account.email": email });
            if (alreadyUser) {
                return res.render("lab/register", {
                    error: "Already a user, please login",
                    status: "",
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newlaboratory = new Lab({
                role: "lab",
                profile: {
                    labName: labName,
                    registrationNo: registrationNo,
                    phoneNo: phoneNo,
                    address: address,
                    pincode: pincode,
                    state: state,
                    city: city,
                    pincode: pincode,
                },
                account: {
                    email: email,
                    password: hashedPassword,
                },
            });
            const saved = newlaboratory.save();
            if (!saved) {
                return res.render("lab/register", {
                    error: "Unable to register",
                    status: "",
                });
            }
            res.render("lab/login", {
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
                        fname: `${labName}`,
                        dashboardLink: `${process.env.HOST_URL}/lab/dashboard`,
                    },
                })
                .then(() => console.log("email has been send!"))
                .catch((e) => console.log(e));
        } catch (err) {
            console.log(err);
            res.render("lab/register", {
                error: "Unable to register",
                status: "",
            });
        }
    }
);

module.exports = router;
