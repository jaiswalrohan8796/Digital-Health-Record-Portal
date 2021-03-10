const router = require("express").Router();

const authRoutes = require("../user/authRoutes.js");
const dashboardRoutes = require("../user/dashboardRoutes");

//authenticate check
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        res.render("user/login", { error: "", status: "Login first" });
    }
    next();
};
//routes
router.use("/user", authRoutes);
router.use("/user", isAuthenticated, dashboardRoutes);

module.exports = router;
