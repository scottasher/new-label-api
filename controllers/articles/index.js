const { Article } = require('../../db');
const keys  = require('../../config/keys');
const { parseArticles } = require('./utils');

module.exports = {
    uploadImage: async (req, res, next) => {
        const { articleImage } = req.files;
        let uploadPath;
        let dir = __dirname.split('/controllers/articles').join("");

        uploadPath = dir + '/uploads/article-images/' + articleImage.name
        articleImage.mv(uploadPath, (err) => {
            if(err) {
                return res.status(500).json(err);
            }
    
            res.json({
                notice: true,
                alert: 'Image uploaded',
                type: 'success',
                description: `The Image has uploaded`,
            });
        })
    },
    create: async (req, res, next) => {
        const { imageName } = req.body;
        const { id, displayName } = req.payload;
        const uploadPath = keys.ROOT_URL + '/article-images/' + imageName;
        const image = { name: imageName, path: uploadPath }; 
        const author = { id: id, name: displayName };
        const newArticle = {
            ...req.body,
            image: JSON.stringify(image),
            author: JSON.stringify(author)
        };
        // console.log('NEW ARTICLE CREATED', newArticle)
        Article.create(newArticle).then(createdArticle => {
            Article.findAll().then(a => {
                return res.json({
                    notice: true,
                    alert: 'Article Created',
                    type: 'success',
                    redirect: '/articles', 
                    description: `Article created with title: ${a.title}`,
                    articles: parseArticles(a),
                });
            })
        }).catch(err => {
            return res.json({
                notice: true,
                alert: 'Article Not Created',
                type: 'warning',
                redirect: '/articles', 
                description: `Failed to create article`,
                err
            });
        })
    },
    all: async (req, res, next) => {
        const data = await Article.findAll({ order: [['createdAt', 'DESC']]})
        return res.json(parseArticles(data))
    },
    getById: (req, res, next) => {
        Article.findOne({ where: {id: req.params.id}, raw: true }).then(data => {
            console.log(JSON.parse(data.author))
            return res.json({
                id: data.id,
                title: data.title,
                textSnippet: data.textSnippet,
                body: data.body,
                category: data.category,
                tags: data.tags.split(','),
                image: JSON.parse(data.image),
                author: JSON.parse(data.author),
                extra1: data.extra1,
                extra2: data.extra2,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            })
        });
    },
    updateById: (req, res, next) => {
        const { imageName } = req.body;
        const { id, displayName } = req.params
        // tags.map(tag => Tag.findOrCreate({ raw: true, where: { name: tag }, defaults: { name: tag} })
        //     .spread((tag, created) => tag));
    
        const uploadPath = keys.ROOT_URL + '/article-images/' + imageName;
        const image = { name: imageName, path: uploadPath };
        const author = { id: id, name: displayName };
    
        const newArticle = {
            ...req.body,
            image: JSON.stringify(image),
            author: JSON.stringify(author)
        };
        Article.findByPk(id).then(foundCourse => {
            if(foundCourse) {
                foundCourse.update(newArticle, {returning: true, where: {id: id} }).then(updated => {  
                    return res.json({
                        article: {
                            id: updated.id,
                            title: updated.title,
                            textSnippet: updated.textSnippet,
                            body: updated.body,
                            category: updated.category,
                            tags: updated.tags.split(','),
                            image: JSON.parse(updated.image),
                            author: JSON.parse(updated.author),
                            extra1: updated.extra1,
                            extra2: updated.extra2,
                            createdAt: updated.createdAt,
                            updatedAt: updated.updatedAt,
                        },
                        alert: 'Article Updated',
                        type: 'success',
                        description: `Article updated`,
                    }) 
                })
            }
        })
    }
};