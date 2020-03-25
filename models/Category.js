module.exports = (sequelize, type) => {
    const Category = sequelize.define('category', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
    });

    return Category
}
