var _ = require('underscore'),
    render = require('./../lib/render'),
    Athlete = require('./../models/athlete'),
    Athletes = require('./../collections/Athletes'),
    AthleteRace = require('./../models/athleteRace'),
    parse = require('co-body'),
    Log = require('log'),
    log = new Log('info');

exports.load = function(app) {

    app.get('/race', function * () {

        this.body = yield render('race', {
            name: "Abhishek kapatkar"
        });
    });

    app.get('/search', function * () {

        if (_.isUndefined(this.query.q)) {
            this.body = yield render('search', {
                title: "Search",
                has_query: false
            });
        } else {

            var names = this.query.q.split(' ');

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
                found: _.size(athletes) > 0,
                total: _.size(athletes),
                athletes: athletes.toJSON()
            });
        }

    });

    app.get('/claim/:uid/athlete', function * (next) {

        this.body = yield render('claim', {
            title: 'Claim'
        });
    });

    app.get('/api/athlete/:uid', function * (next) {

        var athlete = yield new Athlete({
            id: this.params.uid
        }).fetch({
            withRelated: ['races']
        });

        this.body = athlete.toJSON();
    });

    app.put('/api/athlete/:uid', function *(next) {
        log.info("====Response is =====");
        var data = yield parse(this);

        log.info(data);

        // var stat = yield athlete.save();

        // log.info(stat);

        this.body = {sucess: true};
    });
};
