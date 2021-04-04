const nodemailer = require("nodemailer");

require("dotenv").config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "digitalhealthrecord1@gmail.com",
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        refreshToken: process.env.refreshToken,
        accessToken: process.env.accessToken,
    },
});

module.exports = transporter;
