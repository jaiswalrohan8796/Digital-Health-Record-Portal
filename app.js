//require
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
//module imports
const homepageRoutes = require("./routes/homepageRoutes.js");
const userAllRoutes = require("./routes/user/userAllRoutes");
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
app.use(userAllRoutes);
//server
mongoose.connect(
    "mongodb://dhrp:dhrp@dhrp-shard-00-00.9ob7v.mongodb.net:27017,dhrp-shard-00-01.9ob7v.mongodb.net:27017,dhrp-shard-00-02.9ob7v.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-2nmjs6-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        app.listen(port, () => {
            console.log(`I am listing to ${port}`);
        });
    }
);
