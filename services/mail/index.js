const { ROOT_URL_CLIENT } = require('../../config/keys');

module.exports = {   
    generateEmail: (user, password, token) => {
        return {
            password: password,
            recipients: [user.email],
            subject: 'Complete Registration',
            tokenLink: `${ROOT_URL_CLIENT}/api/v1/users/verification/${user.id}/${token.token}`,
            email: user.email,
            sample: 'Please complete sign up...'
        }
    }
}