const authService = require('../services/auth.service');

const paths = ['info','ytsr','download'];

module.exports =  (req, res, next) => {
    return next();
    // if (req.path === '/' && req.method === 'GET') { return next() }

    // if (req.header("x-api-key")) {
    //     authService.validateKey({ key: req.header("x-api-key") }, (err, accessToken) => {
    //         if (err) {
    //             return next(err);
    //         } else if (!accessToken) {
    //             res.status(401).send({ message: 'Accsess denied' });
    //         } else if (accessToken) {
    //             res.set('access-token', accessToken);
    //             return next();
    //         }
    //     });
    // } else if (paths.includes(req.path) req.path && req.method === 'GET' && req.header("x-access-token")) {
    //     if (req.header("x-access-token")) {
    //         authService.validateAccess(req.header("x-access-token"), (err, user) => {
    //             if (err) {
    //                 return next(err);
    //             } else if (user) {
    //                 req.headers['user-name'] = user;
    //                 return next();
    //             } else {
    //                 res.status(401).send({ message: 'Accsess denied' });
    //             }
    //         });
    //     }
    // } else {
    //     res.status(401).send({ message: 'Accsess denied' });
    // }
}