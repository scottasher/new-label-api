const { makeid } = require('../utils');

module.exports = (sequelize, type) => {
    const Token = sequelize.define('token', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: type.STRING,
            allowNull: false
        },
        userId: type.INTEGER
    });

    Token.generate = async function (userId) {
        if (!userId) {
            throw new Error('Token requires a user ID')
        }
        let token = makeid(48);

        return Token.create({ userId: userId, token: token });
    }

    return Token
}