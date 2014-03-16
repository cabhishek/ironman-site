var _ = require('underscore'),
    render = require('./../lib/render');


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

    app.get('/api/search/:name', function * (name) {

        this.body = [{
            name: 'tobi',
            email: 'tobi@segment.io',
            packages: 5,
            friends: ['abby', 'loki', 'jane']
        }, {
            name: 'loki',
            email: 'loki@segment.io',
            packages: 2,
            friends: ['loki', 'jane']
        }, {
            name: 'jane',
            email: 'jane@segment.io',
            packages: 2,
            friends: []
        }, {
            name: 'ewald',
            email: 'ewald@segment.io',
            packages: 2,
            friends: ['tobi']
        }];
    });


};
