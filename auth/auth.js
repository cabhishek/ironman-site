var User = require('./../models/user'),
    render = require('./../lib/render'),
    passport = require('./strategy').init()

exports.routes = function(route) {

    route.get('/login', function* index() {
        this.body =
            yield render('auth/login', {
                greetings: "Hello User"
            });
    })

    route.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))

    route.get('/fail', function* index() {
        this.body =
            yield {
                'status': 'fail'
            }
    })

    route.get('/out', function* index() {
        this.body =
            yield {
                'loggged in status': this.isAuthenticated()
            }
    })

    route.get('/logout', function*(next) {
        this.logout()
        this.redirect('/login')
    })

    route.get('/auth/facebook', passport.authenticate('facebook'));

    route.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

}
