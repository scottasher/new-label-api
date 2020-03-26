const { Contact } = require('../../db');
const Mailer = require('../../services/mail/Mailer');
const { generateEmail } = require('../../services/mail');
const contactUs = require('../../services/mail/templates/contactUs');

module.exports = {
    contact: (req, res, next) => {
        Contact.create(req.body.contact).then(async contact => {
            console.log(contact)
            Mailer({recipients: ['melodiousdin@gmail.com'], subject: `Contact from: ${contact.email}`, ...contact}, contactUs(contact));
            return res.json({
                type: 'success',
                alert: 'Message Sent',
                description: 'You will receive a reply soon! Thank you for you support'
            })

        }).catch((err) => console.log(err))
    }
};