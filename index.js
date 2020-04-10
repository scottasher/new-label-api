const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const keys  = require('./config/keys');
require('cors');

const isProduction = process.env.NODE_ENV === 'production';
const dir = () => {
    if(isProduction) {
        return "https://melodiousdin.com/"
    } 

    return __dirname
}
const app = express();
const passport = require('passport')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

app.get('/api/path', (req, res, next) => {
    res.send(express.static(path.resolve(__dirname, 'uploads')))
})

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static(keys.ROOT_URL + "/uploads"));
require('./services/passport')
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes'));

//Error handlers & middlewares
if(!isProduction) {
    app.use((err, req, res, next) => {
        if(err.name === 'UnauthorizedError') {
            return res.send({ user: { active: false, isAdmin: false } })
        }
            // console.log('[ERROR HANDLERS NOT PRODUCTION]', err, req, res)
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}
  
app.use((err, req, res, next) => {
    console.log('[ERROR HANDLERS NOT PRODUCTION]', err, req, res)
    if(err.name === 'UnauthorizedError') {
        console.log(err, req, res)
        return res.send({ user: { active: false, isAdmin: false } })
    }
    res.status(err.status || 500);
    console.log(err, req, res)
    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

app.listen(keys.PORT, () => {
  console.log(`Server running on port: ${keys.PORT}`)
});