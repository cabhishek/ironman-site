var User         = require('./../models/user'),
    render       = require('./../lib/render'),
    Subscription = require('./../models/subscription'),
    plans        = require('./../data/plans'),
    bcrypt       = require('bcrypt'),
    passport     = require('./strategy').init()

exports.routes = function(route) {

    route.get('/signup', function * () {

        var plan = plans[this.request.query.plan_id || "149_post_race"]

        this.session.plan = plan

        this.body =
            yield render('auth/signup', {
                'planName' : plan.name,
                'price'    : plan.price
            });
    })

    route.post('/signup', function * (next) {

        var formData     = this.request.body,
            salt         = bcrypt.genSaltSync(10),
            passwordHash = bcrypt.hashSync(formData.password, salt)

        //Create user
        var user = yield User.forge({
            'email'      : formData.username,
            'first_name' : formData.first_name,
            'last_name'  : formData.last_name,
            'zipcode'    : formData.zipcode,
            'password'   : passwordHash
        }).save()

        //Activate subscription
        var subscription = yield Subscription.forge({
            'user_id'  : user.id,
            'plan_id'  : '149_onetime',
            'token_id' : JSON.parse(formData.stripeToken).id,
        }).save()

        yield passport.authenticate('local', {
            successRedirect : '/compare',
            failureRedirect : '/login'
        })
    })
}
