const { Article } = require('../../db');
const keys  = require('../../config/keys');
const { parseArticles } = require('./utils');

module.exports = {
    // uploadImage: async (req, res, next) => {
    //     const { articleImage } = req.files;
    //     let uploadPath;
    //     let dir = __dirname.split('/controllers/articles').join("");
        
    //     uploadPath = dir + '/uploads/article-images/' + articleImage.name
        
    //     articleImage.mv(uploadPath, (err) => {
    //         if(err) {
    //             return res.status(500).json(err);
    //         }
    
    //         return res.json({
    //             notice: true,
    //             alert: 'Image uploaded',
    //             type: 'success',
    //             description: `The Image has uploaded`,
    //         });
    //     })
    // },
    create: async (req, res, next) => {
        console.log(req.body)
        // const { imageName } = req.body;
        // const { id, displayName } = req.payload;
        // const uploadPath = keys.ROOT_URL + '/api/images/uploads/article-images/' + imageName;
        // const image = { name: imageName, path: uploadPath }; 
        // const author = { id: id, name: displayName };
        // console.log(author)
        // const newArticle = {
        //     ...req.body,
        //     image: JSON.stringify(image),
        //     author: JSON.stringify(author)
        // };
        // // console.log('NEW ARTICLE CREATED', newArticle)
        // Article.create(newArticle).then(createdArticle => {
        //     Article.findAll().then(a => {
        //         return res.json({
        //             notice: true,
        //             alert: 'Article Created',
        //             type: 'success',
        //             redirect: '/articles', 
        //             description: `Article created with title: ${a.title}`,
        //             articles: parseArticles(a),
        //         });
        //     })
        // }).catch(err => {
        //     return res.json({
        //         notice: true,
        //         alert: 'Article Not Created',
        //         type: 'warning',
        //         redirect: '/articles', 
        //         description: `Failed to create article`,
        //         err
        //     });
        // })
    },
    // all: async (req, res, next) => {
    //     console.log(req.query)
    //     let query = {};
    //     let limit;
    //     query.status = 'public'
    //     if(req.query.status) {
    //         query.status = req.query.status;
    //     }
    //     if(req.query.author) {
    //         query.author = req.query.author;
    //     }
    //     if(req.query.count) {
    //         limit = Number(req.query.count);
    //     }

    //     const data = await Article.findAll({ 
    //         limit: limit, 
    //         where: query, 
    //         order: [['createdAt', 'DESC']] 
    //     })
    //     return res.json(parseArticles(data))
    // },
    // getById: (req, res, next) => {
    //     Article.findOne({ where: {id: req.params.id}, raw: true }).then(data => {
    //         if(!data) {
    //             return res.json({
    //                 redirect: '/404',
    //             })
    //         }
            
    //         return res.json({
    //             id: data.id,
    //             title: data.title,
    //             textSnippet: data.textSnippet,
    //             body: JSON.parse(data.body),
    //             category: data.category,
    //             tags: data.tags.split(','),
    //             image: JSON.parse(data.image),
    //             author: JSON.parse(data.author),
    //             extra1: data.extra1,
    //             extra2: data.extra2,
    //             createdAt: data.createdAt,
    //             updatedAt: data.updatedAt,
    //         })
    //     });
    // },
    // updateById: (req, res, next) => {
    //     const { imageName } = req.body;
    //     // tags.map(tag => Tag.findOrCreate({ raw: true, where: { name: tag }, defaults: { name: tag} })
    //     //     .spread((tag, created) => tag));
    //     const uploadPath = keys.ROOT_URL + '/api/images/uploads/article-images/' + imageName;
    //     const image = { name: imageName, path: uploadPath };
    
    //     const newArticle = {
    //         ...req.body,
    //         image: JSON.stringify(image),
    //     };
    //     Article.findByPk(req.params.id).then(foundCourse => {
    //         console.log(foundCourse)
    //         if(foundCourse) {
    //             foundCourse.update(newArticle, {returning: true, where: {id: req.params.id} }).then(updated => {  
    //                 return res.json({
    //                     article: {
    //                         id: updated.id,
    //                         title: updated.title,
    //                         textSnippet: updated.textSnippet,
    //                         body: updated.body,
    //                         category: updated.category,
    //                         tags: updated.tags.split(','),
    //                         image: JSON.parse(updated.image),
    //                         author: JSON.parse(updated.author),
    //                         createdAt: updated.createdAt,
    //                         updatedAt: updated.updatedAt,
    //                     },
    //                     alert: 'Article Updated',
    //                     type: 'success',
    //                     description: `Article updated`,
    //                 }) 
    //             })
    //         }
    //     })
    // },
    // deleteById: (req, res, next) => {
    //     Article.destroy({
    //         where: {
    //             id: req.params.id
    //         }
    //     }).then(n => {
    //         Article.findAll().then(a => {
    //             return res.json({
    //                 notice: true,
    //                 alert: 'Article deleted',
    //                 type: 'success',
    //                 redirect: '/articles', 
    //                 description: `Article deleted`,
    //                 articles: parseArticles(a),
    //             });
    //         })
    //     })
    // }
};