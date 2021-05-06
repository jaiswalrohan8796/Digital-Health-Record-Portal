const router = require("express").Router();

const authRoutes = require("../user/authRoutes.js");
const dashboardRoutes = require("../user/dashboardRoutes.js");

//authenticate check
const isAuthenticated = (req, res, next) => {
    if (!req.user || req.user.role !== "user") {
        return res.render("user/login", { error: "", status: "Login first" });
    }
    next();
};

//
//routes
router.use("/user", authRoutes);
router.use("/user", isAuthenticated, dashboardRoutes);

module.exports = router;
