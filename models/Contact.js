module.exports = (sequelize, type) => {
    const Contact = sequelize.define('contact', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        email: type.STRING,
        body: type.STRING,
        status: type.STRING,        
    });

    return Contact
}
