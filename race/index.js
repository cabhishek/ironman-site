var _ = require('underscore'),
    render = require('./../lib/render'),
    Athlete = require('./../models/athlete'),
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

    app.get('/api/search/:name', function * (next) {

        var athlete = new Athlete({
            'first_name': 'Gonzalo',
            'last_name': 'portas hernandez'
        });

        yield athlete.fetch({withRelated: ['races']});

        this.body = {
            'athlete': athlete
        };
    });
};
