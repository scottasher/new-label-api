module.exports = {
    parseVideos: (videos) => {
        return videos.map(obj => {
            return {
                id: obj.id,
                title: obj.title,
                description: obj.body,
                category: obj.category,
                tags: obj.tags.split(','),
                video: JSON.parse(obj.image),
                author: JSON.parse(obj.author),
                status: obj.status,
                createdAt: obj.createdAt,
                updatedAt: obj.updatedAt
            }
        })
    }
};