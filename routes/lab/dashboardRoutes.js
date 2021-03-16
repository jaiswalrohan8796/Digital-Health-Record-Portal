const router = require("express").Router();

const Lab = require("../../models/lab/Lab.js");
router.get("/dashboard", async (req, res, next) => {
    res.render("lab/home", {
        lab: req.user,
        labName: `${req.user.profile.labName}`,
    });
});

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
