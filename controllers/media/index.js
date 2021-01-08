const { Video } = require('../../db');
const keys  = require('../../config/keys');
const utils = require('./utils');
const _ = require('lodash');

module.exports = {
    upload: async (req, res, next) => {
        const { files } = req;
        const success = [];
        const fail = [];
        var dir = __dirname.split("/controllers/media").join("");
        let uploadPath;
        let response = {
            notice: true,
            alert: 'File(s) not uploaded',
            type: 'warning',
            description: `The file(s) you provided failed to upload`,  
        };

        if (!files) {
            return res.json({
                notice: true,
                ...response
            })
        }
        const keys = _.keys(files)
        keys.forEach(async key => {
            uploadPath = dir + `/uploads/${key}/` + files[key].name;
            const file = files[key];
            const upload = await utils.upload({file, uploadPath, key})
            // files[key].mv(uploadPath, err => {
            //     if(err) {
            //         return fail.push(files[key].name)
            //     } 
            //     return success.push(files[key].name)
            // });

            try {
                upload()
            } catch(err) {
                console.log(err)
            }
        });


    }
};