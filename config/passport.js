let passport = require('passport');
let models = require('../models/');
let LocalStrategy = require('passport-local').Strategy;

//serializando el obj user paga guardar en sesion
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

// deserializando el obj y devolviendolo
passport.deserializeUser(function (id, done) {
    models.User.findById(id)
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            console.log(err.message);
            done(err)
        })
});

//config de la Strategy
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    models.User.findOne({
        where: {email: email},
        defaults: {password: password}
    }).then((user) => {
        if (user !== null) {
            return done(null, false, {message: 'Email taken'})
        }
        models.User.create({
            email: email,
            password: password
        }).then(user => {
            return done(null, user)
        }).catch(err => {
            return done(null, false, {message: 'Error trung to create a user.'})
        })
    })

}));

//config de la Strategy para signin
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    models.User.findOne({
        where: {email: email},
        defaults: {password: password}
    }).then((user) => {
        if (user === null) {
            return done(null, false, {message: 'Error in the data'})
        }
        return done(null, user)
    })
}));
