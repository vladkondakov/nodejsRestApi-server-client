const jwt = require('jsonwebtoken');
const config = require('config');
const ApiError = require('../error/apierror');
const LowDBOperations = require('../database/lowdb-service');

exports.checkAuth = async function(req, res, next) {
    const authHeader = req.headers.authorization;

    // 
    if (!(authHeader && authHeader.split(' ')[0] === 'Bearer')) {
        res.setHeader('WWW-Authenticate', 'Bearer realm="example"');
        return res.end();
    }

    const bearerToken = authHeader.split(' ')[1];

    jwt.verify(bearerToken, config.get('JWT_ACCESS_SECRET'), async (err, user) => {
        if (err) {
            return next(ApiError.unauthorized("Token is invalid or expired in"))
        }
        const currentUser = await LowDBOperations.getElement('users', { username: user.username });
        if (!currentUser) {
            return next(ApiError.notFound("Requested resource doesn't exist"));
        }
        req.currentUser = currentUser;
        
        return next();
    });
}

// authorization models
exports.compareIdAndUser = function(req, res, next) {
    const id = req.params.id;
    const username = req.currentUser.username;
    if (id !== username) {
        return next(ApiError.forbidden(`Access to that resource is forbidden for employee with username: ${id}`));
    }
    
    return next();
}