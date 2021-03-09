const router = require("express").Router();

//get homepage
router.get("/", (req, res, next) => {
    res.render("index");
});

//user routes
router.get("/user/login", (req, res, next) => {
    res.render("user/login", { error: "", status: "" });
});
router.get("/user/register", (req, res, next) => {
    res.render("user/register", { error: "", status: "" });
});

//doctor routes
router.get("/doctor/login", (req, res, next) => {
    res.render("doctor/login", { heading: "Doctor" });
});
router.get("/doctor/register", (req, res, next) => {
    res.render("doctor/register");
});

//lab routes
router.get("/lab/login", (req, res, next) => {
    res.render("lab/login");
});
router.get("/lab/register", (req, res, next) => {
    res.render("lab/register");
});

module.exports = router;
