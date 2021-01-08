module.exports = (sequelize, type) => {
    const Personnel = sequelize.define('personnel', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        active: { type: type.STRING, default: true },
        name: type.STRING,
        type: type.STRING,
        bio: type.TEXT,
        avatar: type.STRING
    });

    return Personnel
}
