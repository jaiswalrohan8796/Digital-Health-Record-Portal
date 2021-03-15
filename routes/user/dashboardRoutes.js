const router = require("express").Router();

const User = require("../../models/user/User.js");
router.get("/dashboard", async (req, res, next) => {
    res.render("user/home", {
        user: req.user,
        fullName: `${req.user.firstName} ${req.user.lastName}`,
    });
});

router.get("/dashboard/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
