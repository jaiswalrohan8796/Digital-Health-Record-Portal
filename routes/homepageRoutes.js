const router = require("express").Router();
const forgotPasswordRoutes = require("../routes/forgotPasswordRoutes.js");
const changeEmailRoutes = require("../routes/changeEmailRoutes.js");

//authenticate check
const isUserAuthenticated = (req, res, next) => {
    if (req.user && req.user.role === "user") {
        return res.redirect("/user/dashboard");
    }
    next();
};

const isDoctorAuthenticated = (req, res, next) => {
    if (req.user && req.user.role === "doctor") {
        return res.redirect("/doctor/dashboard");
    }
    next();
};
const isLabAuthenticated = (req, res, next) => {
    if (req.user && req.user.role === "lab") {
        return res.redirect("/lab/dashboard");
    }
    next();
};
//get homepage
router.get("/", (req, res, next) => {
    res.render("index");
});
router.get("/about", (req, res, next) => {
    res.render("about");
});
router.get("/contact", (req, res, next) => {
    res.render("contact");
});

//user routes
router.get("/user/login", isUserAuthenticated, (req, res, next) => {
    res.render("user/login", { error: "", status: "" });
});
router.get("/user/register", (req, res, next) => {
    res.render("user/register", { error: "", status: "" });
});

router.use(forgotPasswordRoutes);
router.use(changeEmailRoutes);

//doctor routes
router.get("/doctor/login", isDoctorAuthenticated, (req, res, next) => {
    res.render("doctor/login", { error: "", status: "" });
});
router.get("/doctor/register", (req, res, next) => {
    res.render("doctor/register", { error: "", status: "" });
});

//lab routes
router.get("/lab/login", isLabAuthenticated, (req, res, next) => {
    res.render("lab/login", { error: "", status: "" });
});
router.get("/lab/register", (req, res, next) => {
    res.render("lab/register", { error: "", status: "" });
});

module.exports = router;
