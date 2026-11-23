const jwt = require('jsonwebtoken');

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

function getJwtSecret(name) {
    const secret = process.env[name];
    if (!secret) {
        throw new Error(`${name} must be configured`);
    }
    return secret;
}

function createAccessToken(subject) {
    return jwt.sign(
        { id: subject.id, role: subject.role },
        getJwtSecret('JWT_ACCESS_SECRET'),
        { expiresIn: process.env.JWT_ACCESS_TTL || '15m', issuer: 'telemedicine-app' }
    );
}

function createRefreshToken(subject) {
    return jwt.sign(
        { id: subject.id, role: subject.role },
        getJwtSecret('JWT_REFRESH_SECRET'),
        { expiresIn: process.env.JWT_REFRESH_TTL || '7d', issuer: 'telemedicine-app' }
    );
}

function setAuthCookies(res, subject) {
    const accessToken = createAccessToken(subject);
    const refreshToken = createRefreshToken(subject);
    const secure = process.env.NODE_ENV === 'production';

    res.cookie(ACCESS_COOKIE, accessToken, {
        httpOnly: true,
        secure,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    });
    res.cookie(REFRESH_COOKIE, refreshToken, {
        httpOnly: true,
        secure,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth'
    });
}

function clearAuthCookies(res) {
    res.clearCookie(ACCESS_COOKIE);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
}

function authenticate(req, res, next) {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;
    const token = bearerToken || req.cookies?.[ACCESS_COOKIE];

    if (!token) {
        return res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
        });
    }

    try {
        req.user = jwt.verify(token, getJwtSecret('JWT_ACCESS_SECRET'), {
            issuer: 'telemedicine-app'
        });
        next();
    } catch (error) {
        return res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: 'Invalid or expired authentication' }
        });
    }
}

function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
            });
        }
        next();
    };
}

function requirePatientPage(req, res, next) {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;
    const token = bearerToken || req.cookies?.[ACCESS_COOKIE];

    if (!token) {
        const nextPath = req.originalUrl || req.path;
        return res.redirect(`/login.html?next=${encodeURIComponent(nextPath)}`);
    }

    try {
        const payload = jwt.verify(token, getJwtSecret('JWT_ACCESS_SECRET'), {
            issuer: 'telemedicine-app'
        });

        if (payload.role !== 'patient') {
            return res.redirect('/login.html');
        }

        req.user = payload;
        next();
    } catch (error) {
        const nextPath = req.originalUrl || req.path;
        res.redirect(`/login.html?next=${encodeURIComponent(nextPath)}`);
    }
}

function authorizeSelf(paramName = 'id') {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (req.user.role === 'admin') {
            return next();
        }

        const requestedId = req.params[paramName];
        if (requestedId === undefined || String(req.user.id) === String(requestedId)) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied' });
    };
}

module.exports = {
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    createAccessToken,
    createRefreshToken,
    setAuthCookies,
    clearAuthCookies,
    authenticate,
    authorizeRole,
    requirePatientPage,
    authorizeSelf
};
