const router = require("express").Router();

const authRoutes = require("../lab/authRoutes.js");
const dashboardRoutes = require("../lab/dashboardRoutes");

//authenticate check
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        res.render("lab/login", { error: "", status: "Login first" });
    }
    next();
};
//routes
router.use("/lab", authRoutes);
router.use("/lab", isAuthenticated, dashboardRoutes);

module.exports = router;
