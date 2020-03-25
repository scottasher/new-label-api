const nodemailer = require('nodemailer');
const keys = require('../../config/keys');

module.exports = async (info, email) => {
    const transporter = nodemailer.createTransport({
        host: 'az1-ss18.a2hosting.com',
        port: 465,
        secure: true,
        auth: {
            user: 'admin@melodiousdin.com',
            pass: keys.email_pass
        }
    });

    let send = await transporter.sendMail({
        from: '"Melodious Din" <admin@melodiousdin.com>', 
        to: info.recipients,
        subject: info.subject,
        html: email
    });

    console.log('MESSAGE SENT', send);
};