const Sequelize = require('sequelize');
const keys = require('../config/keys');
const UserModel = require('../models/User')
const ArticleModel = require('../models/Article');
const TokenModel = require('../models/Token');
const CategoryToken = require('../models/Category');
const ContactToken = require('../models/Contact');

const sequelize = new Sequelize(keys.db_name, keys.db_user, keys.db_pass, {
    host: keys.db_host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const User = UserModel(sequelize, Sequelize);
const Article = ArticleModel(sequelize, Sequelize);
const Token = TokenModel(sequelize, Sequelize);
const Category = CategoryToken(sequelize, Sequelize);
const Contact = ContactToken(sequelize, Sequelize);

sequelize.sync({ force: false })
.then(() => {
    console.log(`Database & tables created!`)
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = {
    User,
    Token,
    Article,
    Category,
    Contact,
}