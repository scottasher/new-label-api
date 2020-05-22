const { ROOT_URL } = require('../../config/keys');

module.exports = {   
    generateEmail: (user, password, token) => {
        return {
            password: password,
            recipients: [user.email],
            subject: 'Complete Registration',
            tokenLink: `${ROOT_URL}/api/v1/users/verification/${user.id}/${token.token}`,
            email: user.email,
            sample: 'Please complete sign up...'
        }
    }
}