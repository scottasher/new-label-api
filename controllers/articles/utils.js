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
                image: JSON.parse(obj.id),
                author: JSON.parse(obj.id),
                createdAt: obj.id,
                updatedAt: obj.id
            }
        })
    }
};