const authService = require('../services/auth.service');

const paths = ['/info', '/ytsr', '/download','/'];

module.exports = (req, res, next) => {
    if (req.header("x-api-key")) {
        authService.validateKey({ key: req.header("x-api-key") }, (err, accessToken) => {
            if (err) {
                return next(err);
            } else if (!accessToken) {
                res.status(401).send({ message: 'Accsess denied' });
            } else if (accessToken) {
                res.header('access-token', accessToken);
                return next();
            }
        });
    } else if (paths.includes(req.path) && (req.header("x-access-token")) || req.query.accessToken) {
        const AT = req.query.accessToken || req.header("x-access-token");
        authService.validateAccess(AT, (err, result) => {
            if (result) {
                return next();
            }else if (err) {
                return next(err);
            }
        });
    } else {
        res.status(401).send({ message: 'Accsess denied' });
    }
}