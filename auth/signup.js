var User = require('./../models/user'),
    render = require('./../lib/render'),
    Subscription = require('./../models/subscription'),
    passport = require('./strategy').init()

exports.routes = function(route) {

    route.get('/signup', function * () {
        this.body =
            yield render('auth/signup', {
                greetings: "Sign up"
            });
    })

    route.post('/signup', function*(next){

        var formData = this.request.body;

        //Create a user
        var user = yield User.forge({
            'email': formData.username,
            'first_name': formData.first_name,
            'last_name': formData.last_name,
            'password': formData.password
        }).save()

        //Activate subscription
        var subscription = yield Subscription.forge({
            'user_id': user.id,
            'plan_id': '149_onetime',
            'token_id': JSON.parse(formData.stripeToken).id,
        }).save()

        yield passport.authenticate('local', {
              successRedirect: '/',
              failureRedirect: '/login'
        })
    })
}
