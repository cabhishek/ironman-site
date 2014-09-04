var User     = require('./../models/user'),
    render   = require('./../lib/render'),
    passport = require('./strategy').init()

exports.routes = function(route) {

    route.get('/login', function * index() {

        this.body =
            yield render('auth/login', {
                'loginFail': this.request.query.status == 'fail' ? true : false
            });
    })

    route.post('/login', passport.authenticate('local', {
        successRedirect:  '/compare',
        failureRedirect:  '/login?status=fail'
    }))

    route.get('/status', function * index() {
        this.body =
            yield {
                'loggged in status': this.isAuthenticated()
        }
    })

    route.get('/logout', function * (next) {
        this.logout()
        this.redirect('/login')
    })

    route.get('/forgot', function * index() {

        this.body =
            yield render('auth/forgot');
    })

    route.get('/auth/facebook', passport.authenticate('facebook'));

    route.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect:  '/',
            failureRedirect:  '/login'
        }));
}
