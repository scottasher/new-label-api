const auths = [
    'superAdmin',
    'admin',
    'editor',
    'author',
    'member',
    'subscriber',
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
    member: (req, res, next) => {
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
        if(req.payload.authority === 'member') {
            return next();
        }
        return res.json({
            redirect: "/dashboard",
            type: "error",
            alert: "Not allowed",
            description: "You do not have permission to access this page"
        })
    },
    subscriber: (req, res, next) => {
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
        if(req.payload.authority === 'member') {
            return next();
        }
        if(req.payload.authority === 'subscriber') {
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