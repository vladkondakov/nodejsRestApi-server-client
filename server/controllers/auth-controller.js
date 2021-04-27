const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const ApiError = require('../error/apierror');
const LowDBOperations = require('../database/lowdb-service');

const signUp = async (req, res, next) => {
    if (!req.body.employeeData) {
        const err = ApiError.badRequest(`Wrong body of the request`);
        return next(err);
    }

    const { username, password, ...restProps } = req.body.employeeData;
    
    const employee = await LowDBOperations.getElement('employees', { username });
    
    if (employee) {
        const err = ApiError.badRequest('Employee exists');
        return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    delete restProps.confirmationPassword;

    const employeeToAdd = {
        username,
        password: hashedPassword,
        ...restProps
    };

    await LowDBOperations.saveElement('employees', employeeToAdd);

    res.status(201).json({
        message: "Signed up"
    });
};

const login = async (req, res, next) => {
    const { username, password } = req.body.userData;
    const employee = await LowDBOperations.getElement('employees', { username });

    if (!employee || !(await bcrypt.compare(password, employee.password))) {
        return next(ApiError.badRequest("Incorrect login or password."));
    }

    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);
    
    const userToAdd = {
        username,
        accessToken,
        "loggedInDate": new Date().toUTCString()
    }

    await LowDBOperations.saveElement('refreshTokens', refreshToken);
    await LowDBOperations.saveElement('users', userToAdd);
    
    return res.json({
        accessToken,
        tokenType: "Bearer",
        expiresIn: config.get('ACCESS_TOKEN_TIME'), 
        refreshToken
    });
};

const generateNewToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    
    try {
        await checkGivenRefreshToken(refreshToken);
    } catch (err) {
        return next(err);
    }

    jwt.verify(refreshToken, config.get('JWT_REFRESH_SECRET'), async (err, user) => {
        if (err) {
            return next(ApiError.unauthorized("Can't verify the provided refresh token."));
        }
        const refreshedAccessToken = generateAccessToken(user.username);
        const existingUser = LowDBOperations.getElement('users', { username: user.username });
        existingUser.accessToken = refreshedAccessToken;
        
        await LowDBOperations.updateElement('users', { username: user.username }, existingUser)

        return res.json({ accessToken: refreshedAccessToken });
    });
}

const logout = async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
        await checkGivenRefreshToken(refreshToken);
    } catch (err) {
        return next(err);
    }
    
    jwt.verify(refreshToken, config.get('JWT_REFRESH_SECRET'), async (err, user) => {
        if (err) {
            return next(ApiError.unauthorized("Can't verify the provided refresh token."));
        }
        const username = user.username;
        await LowDBOperations.deleteElement('users', { username });
    });
    
    await LowDBOperations.pullElement('refreshTokens', refreshToken);

    return res.sendStatus(204);
}

const checkGivenRefreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw ApiError.badRequest("The refresh token hasn't been given.");
    }
    const refreshTokens = await LowDBOperations.getAllElements('refreshTokens');
    if (!refreshTokens.includes(refreshToken)) {
        throw ApiError.badRequest("The refresh token provided doesn't exist");
    }

    return { success: true };
}

const generateAccessToken = (username) => {
    const accessToken = jwt.sign(
        { username },
        config.get('JWT_ACCESS_SECRET'),
        { expiresIn: config.get('ACCESS_TOKEN_TIME') }
    );

    return accessToken;
};

const generateRefreshToken = (username) => {
    const refreshToken = jwt.sign(
        { username },
        config.get('JWT_REFRESH_SECRET'),
        { expiresIn: config.get('REFRESH_TOKEN_TIME') }
    );

    return refreshToken;
}

module.exports = {
    signUp,
    login,
    generateNewToken,
    logout
}