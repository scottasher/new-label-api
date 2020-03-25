const { User, Token } = require('../../db');
const passport = require('passport');
const Mailer = require('../../services/mail/Mailer');
const { generateEmail } = require('../../services/mail');
const newUserTemplate = require('../../services/mail/templates/newUserTemplate');
const passwordResetTemplate = require('../../services/mail/templates/passwordResetTemplate');
const { generateHash, checkTokenExp } = require('../../utils');
const { ROOT_URL, ROOT_URL_CLIENT } = require('../../config/keys');

module.exports = {
    all: (req, res, next) => {
        return User.findAll().then(users => res.json(users))
    },
    register: (req, res, next) => {
        const { body: { user } } = req;
        const newUser = {
            hash: generateHash(user.password),
            isAdmin: false,
            name: user.name,
            displayName: user.name,
        };
           
        User.findOrCreate({ where: {email: user.email}, defaults: newUser})
            .then(async ([createdUser, created]) => {
                if(!created) {
                    return res.json({
                        user: { active: false, isAdmin: false },
                        redirect: null,
                        type: 'error',
                        alert: 'Email Taken',
                        description: 'The email supplied is already registed to an account'
                    })
                }
    
                let token = await Token.generate({ user_id: createdUser.id });
                let finalUserEmail = generateEmail(createdUser, token);
                try {
                    await Mailer(finalUserEmail, newUserTemplate(finalUserEmail));
                    return res.json({
                        redirect: '/user/register/result',
                        type: true,
                        status: 'success',
                        title: 'User Created',
                        subTitle: 'You have successfully signed up a user, there will be an email sent to the user with further instructions to start using the system.',
                        email: user.email,
                        user: {active: false, isAdmin: createdUser.isAdmin}
                    });
                } catch (err) {
                    return res.json({
                        user: {active: false},
                        redirect: '/user/register',
                        type: true,
                        status: 'error',
                        title: 'Something went wrong',
                        subTitle: 'Please try again at a later time.'
                    })
                }
            }).catch(err => res.json(err));
    },
    verifyToken: (req, res, next) => {
        const { params } = req;
        if(!params.id || !params.token) { return res.redirect(`${ROOT_URL_CLIENT}/employee/login?activatedUser=false`) }
    
        Token.findOne({ raw: true, where: { token: params.token }}).then(token => {
            // console.log('[TOKEN IN VERIFICATION]', token)
            if(!checkTokenExp(token.createdAt)) {
                Token.destroy({
                    where: {
                        token: params.token
                    }
                }).then( async destroyed => {
                    console.log('TOKEN DESTROYED BECAUSE IT EXPIRED')
                    User.findOne({ 
                        raw: true, 
                        where: { id: params.id },
                        attributes: [ 'id', 'email' ] 
                    }).then(async user => {
                        let token = await Token.generate({userId: user.id, token: randToken });
                        let finalUserEmail = {
                            recipients: [user.email],
                            subject: 'Complete Registration',
                            tokenLink: `${ROOT_URL}/api/v1/users/verification/${user.id}/${token.token}`,
                            email: user.email,
                            sample: 'Please complete sign up...'
                        };
                        try {
                            await Mailer(finalUserEmail, newUserTemplate(finalUserEmail));
                            return res.redirect(`${ROOT_URL_CLIENT}/employee/login?activatedUser=false&emailSent=true`)
                        } catch (err) {
                            res.send(err)
                        }
                    });
                })
            }
    
            if(params.token == token.token) {
                User.update(
                    {active: 1},
                    {returning: true, where: {id: params.id}}
                ).then(i => {
                    Token.destroy({
                        where: {
                            token: params.token
                        }
                    })
                    res.redirect(`${ROOT_URL_CLIENT}/employee/login?activatedUser=true`)
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    },
    login: (req, res, next) => {
        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if(err) {
                return next(err);
            }
            if(!info.email) {
                return res.json({
                    user: {active: false},
                    redirect: '/user/register',
                    currentAuthority: false,
                    type: 'error',
                    alert: 'Unfamiliar Email',
                    description: 'We do not recognize this email, please try again or sign up!',
                })
            }
    
            if(!info.password) {
                return res.json({
                    user: {active: false},
                    redirect: '/user/register',
                    currentAuthority: false,
                    type: 'error',
                    alert: 'Wrong password',
                    description: `Your password is incorrect did you forget it?`,
                })
            }
    
            if(passportUser.active == true) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
    
                if(user.admin == true) {
                    return res.json({
                        redirect: '/dashboard',
                        currentAuthority: 'admin',
                        user: user.toAuthJSON()
                    })
                } else {
                    return res.json({
                        status: 'ok',
                        type: 'account',
                        currentAuthority: 'user',
                        user: user.toAuthJSON()
                    })
                }
            } else {
                return res.json({
                    user: {active: false},
                    redirect: '/user/register',
                    currentAuthority: false,
                    type: 'info',
                    alert: 'Unactive Account',
                    description: 'Please activate your account before you can use our system!',
                })
            }
        })(req, res, next);
    },
    current: (req, res, next) => {
        const id = req.payload.id || null;
    
        if(!id) {
            return res.json({
                status: 'error',
                type:'account',
                description: 'There is currently no logged in user',
                user: {active: false}
            })
        } else {
            return User.findOne({ where: { id: id } }).then(user => {
                if(!user) {
                    return res.json({
                        status: 'error',
                        type:'account',
                        description: 'Cannot find user',
                        user: {active: false}
                    })
                }
                return res.json({ user: user.toAuthCurrentJSON() });
            }).catch(err => res.send(err))
        }
    },
    updatePassReq: (req, res, next) => {
        const { email } = req.body;
        if(!email) { 
            return res.json({
                user: {active: false},
                currentAuthority: false,
                type: 'warning',
                alert: 'Something went wrong',
                description: 'We are not sure what happened, please try again!',
            }); 
        }
    
        User.findOne({ where: {email: email} }).then(async user => {
            if(!user) {
                return res.json({
                    user: {active: false},
                    currentAuthority: false,
                    type: 'warning',
                    alert: 'No account',
                    description: 'There is no account associated with this email. Please sign up!',
                });
            }
    
            let token = await Token.generate({ user_id: user.id });
            let finalEmail = {
                recipients: [user.email],
                subject: 'Password Reset request',
                tokenLink: `${ROOT_URL_CLIENT}/employee/password/reset?token=Token ${token.token}`,
                email: user.email,
            };
            try {
                await Mailer(finalEmail, passwordResetTemplate(finalEmail));
                return res.json({
                    redirect: '/user/login',
                    type: 'success',
                    alert: 'Email Sent',
                    description: 'An email was sent with further instructions to reset your password.',
                    email: user.email,
                    user: {active: false}
                });
            } catch (err) {
                return res.json({
                    user: {active: false},
                    type: 'warning',
                    alert: 'Email Not Sent',
                    description: 'Something went wrong please try again',
                    error: err
                })
            }
        });
    },
    updatePass: (req, res, next) => {
        const { payload: { id }, body } = req;
        const newPass = generateHash(body.password);

        User.findByPk(id).then(user => {
            user.update(
                {hash: newPass},
                {returning: true, where: {id: id} }
            )
            .then(function(updatedUser) {
                return res.json(updatedUser)
            })
            .catch(next)
        }).catch(next);
    },
};