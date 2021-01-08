const { User, Token } = require('../../db');
const passport = require('passport');
const Mailer = require('../../services/mail/Mailer');
const { generateEmail } = require('../../services/mail');
const newUserTemplate = require('../../services/mail/templates/newUserTemplate');
const passwordResetTemplate = require('../../services/mail/templates/passwordResetTemplate');
const { generateHash, checkTokenExp, makeid } = require('../../utils');
const { ROOT_URL, ROOT_URL_CLIENT, webUser, webPass } = require('../../config/keys');

module.exports = {
    all: async (req, res, next) => {
        let limit;
        if(req.query.count) {
            limit = req.query.count;
        }
        const data = await User.findAll({ 
            limit: limit, 
            order: [['createdAt', 'DESC']] 
        })
        return res.json(data)
    },
    findById: (req, res, next) => {
        const { params } = req;

        User.findByPk(params.id).then(user => {
            return res.json({ user: user })
        })
    },
    register: (req, res, next) => {
        const { body: { user } } = req;
        if(!user.password) {
            user.password = makeid(13)
        }
        const newUser = {
            hash: generateHash(user.password),
            name: user.name,
            displayName: user.name,
            ...user
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

                let token = await Token.generate(createdUser.id);
                let finalUserEmail = generateEmail(createdUser, user.password, token);
                const users = await User.findAll();
                try {
                    Mailer(finalUserEmail, newUserTemplate(finalUserEmail));
                    return res.json({
                        redirect: '/admin/users',
                        type: 'success',
                        alert: 'User Created',
                        description: 'You have successfully created a new user',
                        users: users 
                    });
                } catch (err) {
                    return res.json({
                        user: {newUser},
                        type: 'error',
                        alert: 'Something went wrong',
                        title: 'Something went wrong please try again',
                    })
                }
            }).catch(err => res.json(err));
    },
    resendVerifyEmail: async (req, res, next) => {
        const { params } = req;
        const newPass = makeid(13);
       
        Token.destroy({ where: { userId: params.id }}).then(tok => {
            User.update(
                {hash: generateHash(newPass)},{returning: true, where: {id: params.id} }
              )
              .then(async function([ rowsUpdate, updatedUser ]) {
                const user = await User.findByPk(params.id); 
                const token = await Token.generate(params.id);
                const finalUserEmail = generateEmail(user, newPass, token);
                try {
                    Mailer(finalUserEmail, newUserTemplate(finalUserEmail))
                    return res.json({
                        user: user,
                        type: 'success',
                        alert: 'Email Sent',
                        title: 'Successfully sent new verification email',
                    })
                } catch(err) {
                    return res.json({
                        user: user,
                        type: 'error',
                        alert: 'Something went wrong',
                        title: 'Something went wrong please try again',
                    })
                }
              }).catch(next)
        });
    },
    verifyToken: (req, res, next) => {
        const { params } = req;
        if(!params.id || !params.token) { return res.redirect(`${ROOT_URL_CLIENT}/?activatedUser=false`) }
    
        Token.findOne({ raw: true, where: { userId: params.id }}).then(token => {
            // console.log('[TOKEN IN VERIFICATION]', token)
            if(!checkTokenExp(token.createdAt)) {
                Token.destroy({
                    where: {
                        token: params.token
                    }
                }).then( async destroyed => {
                    // console.log('TOKEN DESTROYED BECAUSE IT EXPIRED')
                    User.findOne({ 
                        raw: true, 
                        where: { id: params.id },
                        attributes: [ 'id', 'email' ] 
                    }).then(async user => {
                        let token = await Token.generate(user.id);
                        let finalUserEmail = {
                            recipients: [user.email],
                            subject: 'Complete Registration',
                            tokenLink: `${ROOT_URL}/api/v1/users/verification/${user.id}/${token.token}`,
                            email: user.email,
                            sample: 'Please complete sign up...'
                        };
                        try {
                            await Mailer(finalUserEmail, newUserTemplate(finalUserEmail));
                            return res.redirect(`${ROOT_URL_CLIENT}/?activatedUser=false&emailSent=true`)
                        } catch (err) {
                            res.send(err)
                        }
                    });
                })
            }
    
            if(params.token === token.token) {
                User.update(
                    {active: 1},
                    {returning: true, where: {id: params.id}}
                ).then(i => {
                    Token.destroy({
                        where: { userId: params.id }
                    })
                    res.redirect(`${ROOT_URL_CLIENT}/?activatedUser=true`)
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
                    redirect: '/',
                    currentAuthority: false,
                    type: 'error',
                    alert: 'Unfamiliar Email',
                    description: 'We do not recognize this email, please try again or sign up!',
                })
            }
    
            if(!info.password) {
                return res.json({
                    user: {active: false},
                    redirect: '/',
                    currentAuthority: false,
                    type: 'error',
                    alert: 'Wrong password',
                    description: `Your password is incorrect did you forget it?`,
                })
            }
    
            if(passportUser.active == true) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
    
                return res.json({
                    redirect: '/dashboard',
                    type: 'login',
                    currentAuthority: user.authority,
                    user: user.toAuthJSON()
                })
            } else {
                return res.json({
                    user: {active: false},
                    redirect: '/',
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
    
            let token = await user.generateJWT();
            let finalEmail = {
                recipients: [user.email],
                subject: 'Password Reset request',
                tokenLink: `${ROOT_URL_CLIENT}/employee/password/reset?token=${token}`,
                email: user.email,
            };
            try {
                await Mailer(finalEmail, passwordResetTemplate(finalEmail));
                return res.json({
                    redirect: '/',
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
        console.log(req)
        const newPass = generateHash(body.password);
        console.log(req.payload)
        User.findByPk(id).then(user => {    
            user.update(
                {hash: newPass},
                {returning: true, where: {id: id} }
            )
            .then(function(updatedUser) {
                return res.json({
                    redirect: '/',
                    type: 'success',
                    alert: 'Password updated',
                    description: 'You have successfully updated your password'
                })
            })
            .catch(next)
        }).catch(next);
    },
    deleteUser: async (req, res, next) => {
        console.log(req.params)
        if(req.params.id === req.payload.id) {
            return User.findAll().then(users => {
                return res.json({
                    users: users,
                    type: 'error',
                    alert: 'User not deleted',
                    description: 'You cannot delete yourself'
                })
            })
        }
        User.destroy({where: {id: req.params.id}}).then(destroyed => {
            User.findAll().then(users => {
                return res.json({
                    users: users,
                    type: 'success',
                    alert: 'User Deleted',
                    description: 'You have successfully deleted a user'
                })
            })
        });
    },
    update: async (req, res, next) => {
        const { params: { id }, body } = req;

        User.findByPk(id).then(user => {
            Object.keys(body.user).map(item => {
                return user[item] = body.user[item]
            })
            res.send(user)
            // user.update(
            //     {id: id},
            //     {where: body.user}
            // ).then(updated => {
            //     res.json(updated)
            // })
        })
    },
};