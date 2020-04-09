const auths = [
    'superAdmin',
    'admin',
    'editor',
    'author'
]

const authority = {
    superAdmin: (req, res, next) => {
        if(req.payload.authority === 'superAdmin') {
            return next();
        } 
        return res.json({
            redirect: "/dashboard",
            type: "error",
            alert: "Not allowed",
            description: "You do not have permission to access this page"
        })
    },
    admin: (req, res, next) => {
        if(req.payload.authority === 'superAdmin') {
            return next();
        }
        if(req.payload.authority === 'admin') {
            return next();
        }
        return res.json({
            redirect: "/dashboard",
            type: "error",
            alert: "Not allowed",
            description: "You do not have permission to access this page"
        })
    },
    editor: (req, res, next) => {
        if(req.payload.authority === 'superAdmin') {
            return next();
        }
        if(req.payload.authority === 'admin') {
            return next();
        }
        if(req.payload.authority === 'editor') {
            return next();
        }
        return res.json({
            redirect: "/dashboard",
            type: "error",
            alert: "Not allowed",
            description: "You do not have permission to access this page"
        })
    },
    editor: (req, res, next) => {
        if(req.payload.authority === 'superAdmin') {
            return next();
        }
        if(req.payload.authority === 'admin') {
            return next();
        }
        if(req.payload.authority === 'editor') {
            return next();
        }
        if(req.payload.authority === 'author') {
            return next();
        }
        return res.json({
            redirect: "/dashboard",
            type: "error",
            alert: "Not allowed",
            description: "You do not have permission to access this page"
        })
    },
}

module.exports = authority