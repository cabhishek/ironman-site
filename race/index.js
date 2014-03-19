var _ = require('underscore'),
    render = require('./../lib/render'),
    Athlete = require('./../models/athlete'),
    Athletes = require('./../collections/Athletes'),
    AthleteRace = require('./../models/athleteRace'),
    Log = require('log'),
    log = new Log('info');

exports.load = function(app) {

    app.get('/race', function * () {

        this.body = yield render('race', {
            name: "Abhishek kapatkar"
        });
    });

    app.get('/search', function * () {

        this.body = yield render('search', {
            title: "Search"
        });
    });

    app.get('/api/search/:q', function * (next) {

        var names = this.params.q.split(' ');

        var firstName = _.first(names);
        var lastName = _.rest(names, 1).join(' ');

        var athletes = yield new Athletes().query({
            where: {
                'first_name': firstName,
                'last_name': lastName
            }
        }).fetch({
            withRelated: ['races']
        });

        this.body = yield render('race', {
            athletes: athletes.toJSON()
        });
    });
};
