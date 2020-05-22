const Sequelize = require('sequelize');
const keys = require('../config/keys');
const UserModel = require('../models/User')
const ArticleModel = require('../models/Article');
const VideoModel = require('../models/Video');
const TokenModel = require('../models/Token');
const CategoryModel = require('../models/Category');
const ContactModel = require('../models/Contact');
const MailingListUserModel = require('../models/MailingListUser');

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
const Video = VideoModel(sequelize, Sequelize);
const Token = TokenModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const Contact = ContactModel(sequelize, Sequelize);
const MailingListUser = MailingListUserModel(sequelize, Sequelize);

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
    MailingListUser,
    Video,
}