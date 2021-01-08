const _ = require('lodash');

const upload = (obj) => {
    return new Promise((resolve, reject) => {
        const move = obj.file.mv(obj.uploadPath).then((res) => {
            console.log(res)
        });
        
    });
};

exports.upload = upload;
