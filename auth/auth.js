var User = require('./../models/user'),
    render = require('./../lib/render'),
    passport = require('./strategy').init()

exports.routes = function(app) {

    app.get('/login', function* index() {
        this.body =
            yield render('auth/login', {
                greetings: "Hello User"
            });
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/landing',
        failureRedirect: '/fail'
    }))
}
