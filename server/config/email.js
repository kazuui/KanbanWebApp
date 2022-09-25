const nodemailer = require("nodemailer");
require('dotenv/config');

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

module.exports = {nodemailer, transporter};
