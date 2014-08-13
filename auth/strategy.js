var co = require('co'),
    passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('./../models/user')

exports.init = function() {
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        co(function * () {
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
        co(function * () {

            console.log("Inside LocalStrategy")

            console.log(username)
            console.log(password)

            //Passport JS works well with usernames
            var user =
                yield new User({
                    'email': username,
                    'password': password
                }).fetch();

            console.log(user)

            if (user) {
                if (username === user.get('email') && password === user.get('password')) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } else {
                done(null, false)
            }
        })()
    }))

    // passport.use(new FacebookStrategy({
    //         clientID: 603335306450490,
    //         clientSecret: '75c245c512210a6a71b35739fb5fbb64',
    //         callbackURL: "http://www.example.com/auth/facebook/callback"
    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         console.log(profile)
    //         console.log(accessToken)
    //         console.log(user)

    //         done(null, user);
    //     }
    // ));

    return passport
}
