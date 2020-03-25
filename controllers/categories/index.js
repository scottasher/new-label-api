const { Category } = require('../../db');

module.exports = {
    all: (req, res, next) => {
        return Category.findAll().then(categories => res.json({ categories }))
    },
    create: (req, res, next) => {
        return Category.findOrCreate({ 
            where: {name: req.body.name}, 
            defaults: req.body.name
        }).then(([category, created]) => {
            Category.findAll().then(cats => {
                return res.json({ 
                    alert: 'Category created',
                    type: 'success',
                    description: `Category created successfully with name: ${category.name}`,
                    categories: cats 
                })
            })
        })
    }
};