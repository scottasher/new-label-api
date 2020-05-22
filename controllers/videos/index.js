const { Video } = require('../../db');
const keys  = require('../../config/keys');
const { parseVideos } = require('./utils');

module.exports = {
    upload: async (req, res, next) => {
        const { video } = req.files;
        let uploadPath;
        let dir = __dirname.split('/controllers/videos').join("");
        
        uploadPath = dir + '/uploads/videos/' + video.name
        
        video.mv(uploadPath, (err) => {
            if(err) {
                return res.status(500).json(err);
            }
    
            return res.json({
                notice: true,
                alert: 'Video uploaded',
                type: 'success',
                description: `The Video has uploaded`,
            });
        })
    },
    create: async (req, res, next) => {
        const { videoName } = req.body;
        const { id, displayName } = req.payload;
        const uploadPath = keys.ROOT_URL + '/api/images/uploads/videos/' + videoName;
        const video = { name: videoName, path: uploadPath }; 
        const author = { id: id, name: displayName };
        console.log(author)
        const newVideo = {
            ...req.body,
            video: JSON.stringify(video),
            author: JSON.stringify(author)
        };
        // console.log('NEW ARTICLE CREATED', newVideo)
        Video.create(newVideo).then(createdArticle => {
            Video.findAll().then(a => {
                return res.json({
                    notice: true,
                    alert: 'Video Created',
                    type: 'success',
                    redirect: '/videos', 
                    description: `Video created with title: ${a.title}`,
                    articles: parseVideos(a),
                });
            })
        }).catch(err => {
            return res.json({
                notice: true,
                alert: 'Video Not Created',
                type: 'warning',
                redirect: '/videos', 
                description: `Failed to upload video`,
                err
            });
        })
    },
    all: async (req, res, next) => {
        console.log(req.query)
        let query = {};
        let limit;
        query.status = 'public'
        if(req.query.status) {
            query.status = req.query.status;
        }
        if(req.query.author) {
            query.author = req.query.author;
        }
        if(req.query.count) {
            limit = Number(req.query.count);
        }

        const data = await Video.findAll({ 
            limit: limit, 
            where: query, 
            order: [['createdAt', 'DESC']] 
        })
        return res.json(parseVideos(data))
    },
    getById: (req, res, next) => {
        Video.findOne({ where: {id: req.params.id}, raw: true }).then(data => {
            if(!data) {
                return res.json({
                    redirect: '/videos',
                })
            }
            return res.json({
                id: data.id,
                title: data.title,
                description: data.description,
                category: data.category,
                tags: data.tags.split(','),
                video: JSON.parse(data.video),
                author: JSON.parse(data.author),
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            })
        });
    },
    updateById: (req, res, next) => {
        const { videoName } = req.body;
        // tags.map(tag => Tag.findOrCreate({ raw: true, where: { name: tag }, defaults: { name: tag} })
        //     .spread((tag, created) => tag));
        const uploadPath = keys.ROOT_URL + '/api/images/uploads/videos/' + videoName;
        const video = { name: videoName, path: uploadPath };
    
        const newVideo = {
            ...req.body,
            video: JSON.stringify(video),
        };
        Video.findByPk(req.params.id).then(foundVideo => {
            console.log(foundVideo)
            if(foundVideo) {
                foundVideo.update(newVideo, {returning: true, where: {id: req.params.id} }).then(updated => {  
                    return res.json({
                        video: {
                            id: updated.id,
                            title: updated.title,
                            description: updated.description,
                            category: updated.category,
                            tags: updated.tags.split(','),
                            video: JSON.parse(updated.video),
                            author: JSON.parse(updated.author),
                            createdAt: updated.createdAt,
                            updatedAt: updated.updatedAt,
                        },
                        alert: 'Video Updated',
                        type: 'success',
                        description: `Video updated`,
                    }) 
                })
            }
        })
    }
};