function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/');
    }
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/');
    }
}

module.exports = {
    isLoggedIn,
    notLoggedIn
};