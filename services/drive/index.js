const keys = require('../../config/keys');
const { google } = require('googleapis');

// configure a JWT auth client
let driveClient = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/drive']
);

//authenticate request
driveClient.authorize(function (err, tokens) {
    if (err) {
        console.log('DRIVE ERROR', err);
        return;
    } else {
        console.log("Successfully connected to google drive!");
    }
});

module.exports = driveClient;


