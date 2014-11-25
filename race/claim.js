var _      = require('underscore'),
    render = require('./../lib/render'),
    Log    = require('log'),
    log    = new Log('info')

exports.routes = function(route) {

    route.get('/claim/:uid/athlete', function*(next) {

        this.body =
            yield render('claim', {
                title: 'Claim Races'
            });
    });

    route.get('/confirmation', function*(next) {

        this.body =
            yield render('claim', {
                title: 'Confirmation'
            });
    });
};
