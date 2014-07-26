var User = require('./../models/user'),
    render = require('./../lib/render'),
    passport = require('./strategy').init()

exports.routes = function(app) {

    app.get('/login', function* index() {
        this.body =
            yield render('auth/login', {
                greetings: "Hello User"
            });
    })

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))

    app.get('/fail', function* index() {
        this.body =
            yield {
                'status': 'fail'
            }
    })

    app.get('/out', function* index() {
        this.body =
            yield {
                'loggged in status': this.isAuthenticated()
            }
    })

    app.get('/logout', function*(next) {
        this.logout()
        this.redirect('/out')
    })

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

}
