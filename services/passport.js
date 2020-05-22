const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { isValidPassword } = require('../utils')
const { User } = require('../db');

passport.serializeUser(function(user, cb) {
    cb(err, user);
}); 

passport.deserializeUser(function(id, cb) {
    User.findOne({ where: { id: id }}).then(user => {
        cb(err, user)
    })
});

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
    console.log('IN PASSPORT',email, password, done)
    User.findOne({ where: { email: email } }).then(u => {
        if(!u) {
            return done(null, false, { email: false })
        }
        if(!isValidPassword(password, u.dataValues.hash)) {
            return done(null, false, { email: true, password: false })
        }
        return done(null, u, { email: true, password: true })
    })
    .catch(err => done(err))
}));
