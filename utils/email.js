const nodemailer = require("nodemailer");
const Email = require("email-templates");
const path = require("path");
require("dotenv").config();

//transporter
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

//templates
const emailTemplate = new Email({
    transport: transporter,
    send: true,
    preview: false,
    views: {
        options: {
            extension: "ejs",
        },
        root: "email-templates",
    },
});

module.exports = emailTemplate;
