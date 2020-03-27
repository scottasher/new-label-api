const { Contact, MailingListUser } = require('../../db');
const Mailer = require('../../services/mail/Mailer');
const contactUs = require('../../services/mail/templates/contactUs');
const mailingSignUp = require('../../services/mail/templates/mailingSignUp');

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
    },
    addToMailingList: (req, res, next) => {
        MailingListUser.create(req.body).then(async user => {
            console.log(user)
            Mailer({recipients: [user.email], subject: 'You signed up for our mailing list', ...user}, mailingSignUp(user))
            return res.json({
                type: 'success',
                alert: 'Signed up successfully',
                description: `You will receive a confirmation email soon to email: ${user.email}`
            })
        });
    },
};