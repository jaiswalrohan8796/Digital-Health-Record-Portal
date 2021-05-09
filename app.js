//require
const express = require("express");
const path = require("path");
const http = require("http");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("dotenv").config();

//module imports
const homepageRoutes = require("./routes/homepageRoutes.js");
const userAllRoutes = require("./routes/user/userAllRoutes");
const labAllRoutes = require("./routes/lab/labAllRoutes");
const doctorAllRoutes = require("./routes/doctor/doctorAllRoutes");

const User = require("./models/user/User.js");
const Doctor = require("./models/doctor/Doctor.js");

//configuration
const PORT = process.env.PORT || 3000;
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
app.use(doctorAllRoutes);

//404 page route
app.get("*", (req, res) => {
    res.render("404");
});

//socket.io config for chats
const httpServer = http.createServer(app);
const formatMessage = require("./utils/chatUtillity.js");
const io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
    //socket joinroom event
    socket.on("joinroom", async ({ ID, treatmentNo, selfID, role }) => {
        //check if the user is a user or doctor
        let user;
        if (role === "user") {
            user = await User.findOne({ _id: selfID });
        } else {
            user = await Doctor.findOne({ _id: selfID });
        }
        //actually join the socket room "ID-treatmentNo"
        socket.join(`${ID}-${treatmentNo}`);

        //emit the joiner a "welcome"
        socket.emit(
            "botMessage",
            formatMessage(
                user._id,
                `Welcome ${user.profile.firstName} ${user.profile.lastName}`
            )
        );
        //broadcast to all client but user => user joined
        socket.broadcast
            .to(`${ID}-${treatmentNo}`)
            .emit(
                "botMessage",
                formatMessage(
                    user._id,
                    `${user.profile.firstName} ${user.profile.lastName} has joined`
                )
            );
        //listening to "chat" event
        socket.on("chat", (data) => {
            io.to(`${ID}-${treatmentNo}`).emit(
                "chat",
                formatMessage(user._id, data)
            );
        });
        //broadcast to all client but user => user left
        socket.on("disconnect", () => {
            if (user) {
                io.to(`${ID}-${treatmentNo}`).emit(
                    "botMessage",
                    formatMessage(
                        user._id,
                        `${user.profile.firstName} ${user.profile.lastName} has left`
                    )
                );
            }
        });
    });
});


//server process.env.mongoDBURI
mongoose.connect(
    process.env.mongoDBURI,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        httpServer.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        });
    }
);
