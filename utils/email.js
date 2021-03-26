const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "ronjazz8796@gmail.com",
        clientId:
            "588279492313-ejhsru7oarlci45ii8afrobt7pf263sb.apps.googleusercontent.com",
        clientSecret: "ypEgpLQywwYdKt2nkl0BKGVF",
        refreshToken:
            "1//04hkyIsIDmEiqCgYIARAAGAQSNwF-L9Ir50rpvFe3RcFqRZtcvUmeHBTlDp8T7DPGnRiQX3Fo0YvfsSa8ZHoXWpACkynv0DzjT5I",
        accessToken:
            "ya29.a0AfH6SMAOAmR6zOo_fGi5WrCWbMMSVrMc4lrXdLQbG9SjBzSY7UdVFszR2Bn95n7MRVRwdviczG5cXzBwfPB_Zq9fIRzG4sSK401vXVLgaFJrfnBAmIVFfVFYqscMteAddXATd0UFnICn_UJGf_E75I9t36oh",
    },
});

module.exports = transporter;
