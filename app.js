//require
const express = require("express");
const path = require("path");
const ejs = require("ejs");

//configuration
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

//routes
app.get("/", (req, res, next) => {
    res.render("home");
});
app.get("/user/login", (req, res, next) => {
    res.render("user/login", { heading: "User" });
});
app.get("/doctor/login", (req, res, next) => {
    res.render("doctor/login", { heading: "Doctor" });
});
app.get("/lab/login", (req, res, next) => {
    res.render("lab/login", { heading: "Laboratory" });
});
//server
app.listen(port, () => {
    console.log(`I am listing to ${port}`);
});
