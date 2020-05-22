module.exports = (sequelize, type) => {
    const Video = sequelize.define('video', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: type.STRING,
        title: type.STRING,
        description: type.TEXT,
        category: type.STRING,
        tags: type.STRING,
        video: type.STRING,
        author: type.STRING,
    });

    return Video
}