var _ = require('underscore'),
    render = require('./../lib/render');


exports.load = function(app) {

    app.get('/race', function *() {

        this.body = yield render('race', {
            name: "Abhishek kapatkar"
        });
    });

    app.get('/race/history', function *() {

        this.body = yield render('history', {
            name: "Abhishek kapatkar"
        });
    });
};
