const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        hash: type.STRING,
        email: { type: type.STRING, allowNull: false },
        name: type.STRING,
        displayName: type.STRING,
        avatar: type.STRING,
        isAdmin: { type: type.BOOLEAN, defaultValue: false },
        active: { type: type.BOOLEAN, defaultValue: false },
        notifyCount: { type: type.INTEGER, defaultValue: 0 },
        unreadCount: { type: type.INTEGER, defaultValue: 0 },
    })

    User.prototype.generateJWT = function() {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);
        const sign = jwt.sign({
            displayName: this.displayName,
            email: this.email,
            id: this.id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, keys.cookieKey);
        // console.log('[SIGN JWT]', sign, this.email, this.id)
        console.log('JWT SIGN',sign)

        return sign;
    }

    User.prototype.toAuthJSON = function() {
        return {
            id: this.id,
            token: this.generateJWT(),
            email: this.email,
            profile: this.profile,
            name: this.name,
            displayName: this.displayName,
            avatar: this.avatar,
            isAdmin: this.isAdmin,
            active: this.active,
            notifyCount: this.notifyCount,
            unreadCount: this.unreadCount
        };
    };

    User.prototype.toAuthCurrentJSON = function() {
        return {
            id: this.id,
            email: this.email,
            profile: this.profile,
            name: this.name,
            displayName: this.displayName,
            avatar: this.avatar,
            isAdmin: this.isAdmin,
            active: this.active,
            notifyCount: this.notifyCount,
            unreadCount: this.unreadCount
        };
    };

    return User  
}