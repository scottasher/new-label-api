module.exports = {
    parseArticles: (articles) => {
        return articles.map(obj => {
            return {
                id: obj.id,
                title: obj.title,
                textSnippet: obj.textSnippet,
                body: obj.body,
                category: obj.category,
                tags: obj.tags.split(','),
                image: JSON.parse(obj.image),
                author: JSON.parse(obj.author),
                status: obj.status,
                createdAt: obj.createdAt,
                updatedAt: obj.updatedAt
            }
        })
    }
};