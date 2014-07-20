var passport = require('koa-passport'),
    co = require('co'),
    User = require('./../models/user'),
    render = require('./../lib/render'),
    passport = require('koa-passport')

exports.load = function(app) {
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        co(function*() {
            var user =
                yield new User({
                    'id': id
                }).fetch();

            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })()
    })

    var LocalStrategy = require('passport-local').Strategy

    passport.use(new LocalStrategy(function(username, password, done) {
        co(function*() {

            var user =
                yield new User({
                    'username': username,
                    'password': password
                }).fetch();

            if (username === user.get('username') && password === user.get('password')) {
                done(null, user)
            } else {
                done(null, false)
            }
        })()
    }))

    app.get('/login', function* index() {
        this.body =
            yield render('auth/login', {
                greetings: "Hello User"
            });
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/landing',
            failureRedirect: '/fail'
        })
    )
}
