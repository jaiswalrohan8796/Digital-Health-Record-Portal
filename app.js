//require
const express = require("express");
const path = require("path");
const ejs = require("ejs");

//module imports
const homepageRoutes = require("./routes/homepageRoutes.js");

//configuration
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

//routes
app.use(homepageRoutes);
//server


app.listen(port, () => {
    console.log(`I am listing to ${port}`);
});
