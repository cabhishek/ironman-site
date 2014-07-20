var co = require('co'),
    passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('./../models/user')

exports.init = function() {
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

    passport.use(new LocalStrategy(function(username, password, done) {
        co(function*() {

            var user =
                yield new User({
                    'username': username,
                    'password': password
                }).fetch();

            if (user) {
                if (username === user.get('username') && password === user.get('password')) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } else {
                done(null, false)
            }
        })()
    }))

    return passport
}
