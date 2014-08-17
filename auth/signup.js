var User = require('./../models/user'),
    render = require('./../lib/render'),
    Subscription = require('./../models/subscription'),
    passport = require('./strategy').init(),
    bcrypt = require('bcrypt')

exports.routes = function(route) {

    route.get('/signup', function * () {

        var query = this.request.query,
            price = 0,
            planName = ''

        if (query && query.plan == "149_post_race") {
            price = 149
            planName = "Post-Race Analysis"
        }

        this.body =
            yield render('auth/signup', {
                'planName': planName,
                'price': price
            });
    })

    route.post('/signup', function * (next) {

        var formData = this.request.body,
            salt = bcrypt.genSaltSync(10),
            passwordHash = bcrypt.hashSync(formData.password, salt)

        //Create user
        var user = yield User.forge({
            'email': formData.username,
            'first_name': formData.first_name,
            'last_name': formData.last_name,
            'password': passwordHash
        }).save()

        //Activate subscription
        var subscription = yield Subscription.forge({
            'user_id': user.id,
            'plan_id': '149_onetime',
            'token_id': JSON.parse(formData.stripeToken).id,
        }).save()

        yield passport.authenticate('local', {
            successRedirect: '/compare',
            failureRedirect: '/login'
        })
    })
}
