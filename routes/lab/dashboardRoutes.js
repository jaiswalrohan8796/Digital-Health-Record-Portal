const router = require("express").Router();

const Lab = require("../../models/lab/Lab.js");
router.get("lab/dashboard", async (req, res, next) => {
    res.render("lab/home", { lab: req.lab ,lab_Name:`${req.lab.labName}`});
});

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
