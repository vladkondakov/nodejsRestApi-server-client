const router = require('express').Router();
const { authValidation } = require('../middlewares/validations');
const AuthController = require('../controllers/auth-controller');

// /auth/signup
router.route('/signup')
    .get((req, res) => {
        res.send('Sign up Page');
    })
    .post(authValidation, AuthController.signUp)

// /auth/login
router.route('/login')
    .get((req, res) => {
        res.send('Login Page.');
    })
    .post(authValidation, AuthController.login)

// /auth/refresh
router.route('/refresh')
    .post(AuthController.generateNewToken)

// /auth/logout
router.route('/logout')
    .delete(AuthController.logout)

module.exports = router;