const router = require("express").Router();

const authRoutes = require("../doctor/authRoutes.js");
const dashboardRoutes = require("../doctor/dashboardRoutes.js");

//authenticate check
const isAuthenticated = (req, res, next) => {
    if (!req.doctor) {
        res.render("doctor/login", { error: "", status: "Login first" });
    }
    next();
};
//routes
router.use("/doctor", authRoutes);
router.use("/doctor", isAuthenticated, dashboardRoutes);

module.exports = router;
