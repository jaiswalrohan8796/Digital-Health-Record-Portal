const router = require("express").Router();

const Lab = require("../../models/lab/Lab.js");
router.get("/dashboard", async (req, res, next) => {
    res.render("lab/home", { lab: req.lab ,lab_Name:`${req.lab.labName}`});
});

module.exports = router;
