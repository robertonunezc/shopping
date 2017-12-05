let express = require('express');
let router = express.Router();
let csrf = require('csurf');
let passport = require('passport');
let models = require('../models');
let csrfProtection = csrf();
let autMiddlewares = require('../middlewares/auth');

router.use(csrfProtection);

router.get('/profile', autMiddlewares.isLoggedIn, (req, res, next) => {
    models.Order.findAll({
        where: {UserId: req.user.id}
    })
        .then(orders => {
            res.render('user/profile', {
                user: req.user,
                orders: orders
            })
        })

});

router.get('/logout', autMiddlewares.isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/')
});

//esta ruta se aplica a todas las rutas q hay debajo de ellas  es decir aplica el middleware notLoggedIn a todas
router.use('/', autMiddlewares.notLoggedIn, function (req, res, next) {
    return next();
});

/* GET users listing. */
router.get('/signin', function (req, res, next) {
    let messages = req.flash('error');
    res.render('user/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.get('/signup', function (req, res, next) {
    let messages = req.flash('error');
    res.render('user/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

//aqui aplicamos passport
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res) {
    if (req.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }
});

//aqui aplicamos passport
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res) {
    if (req.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }
});

module.exports = router;

