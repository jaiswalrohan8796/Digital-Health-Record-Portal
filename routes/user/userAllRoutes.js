const router = require("express").Router();

const authRoutes = require("../user/authRoutes.js")


//routes
router.use(authRoutes)




module.exports = router;