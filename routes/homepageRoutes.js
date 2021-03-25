const router = require("express").Router();

//get homepage
router.get("/h", (req, res, next) => {
    res.render("index");
});
router.get("/about", (req, res, next) => {
    res.render("about");
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
    res.render("doctor/login",{ error: "", status: "" });
});
router.get("/doctor/register", (req, res, next) => {
    res.render("doctor/register", { error: "", status: "" });
});

//lab routes
router.get("/lab/login", (req, res, next) => {
    res.render("lab/login",{ error: "", status: "" });
});
router.get("/lab/register", (req, res, next) => {
    res.render("lab/register",{ error: "", status: "" });
});

module.exports = router;
