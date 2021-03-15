//require
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("dotenv").config();

//module imports
const homepageRoutes = require("./routes/homepageRoutes.js");
const userAllRoutes = require("./routes/user/userAllRoutes");
const labAllRoutes=require("./routes/lab/labAllRoutes")

//configuration
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(homepageRoutes);
app.use(userAllRoutes);
app.use(labAllRoutes);

//server process.env.mongoDBURI
mongoose.connect("mongodb://localhost:27017/DHRP"
     ,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        app.listen(port, () => {
            console.log(`Listening to ${port}`);
    
        });
    }
);
