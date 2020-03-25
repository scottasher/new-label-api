const { makeid } = require('../utils');

module.exports = (sequelize, type) => {
    const Article = sequelize.define('article', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        status: type.STRING,
        title: type.STRING,
        textSnippet: type.TEXT,
        body: type.TEXT,
        category: type.STRING,
        tags: type.STRING,
        image: type.STRING,
        author: type.STRING,
    });

    return Article
}
