module.exports = (sequelize, type) => {
    const MailingListUser = sequelize.define('mailing-list-user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        active: { type: type.BOOLEAN, default: 1 },
        email: type.STRING,
    });

    return MailingListUser
}
