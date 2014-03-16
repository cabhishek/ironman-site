var _ = require('underscore'),
    render = require('./../lib/render');


exports.load = function(app) {

    app.get('/race', function *() {

        this.body = yield render('race', {
            name: "Abhishek kapatkar"
        });
    });

    app.get('/search:name', function *(name) {

        this.body = yield render('race', {
            name: "Abhishek kapatkar"
        });
    });

    app.get('/search', function *() {

        this.body = yield render('search', {
            title: "Search"
        });
    });
};
