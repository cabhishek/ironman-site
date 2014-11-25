var Backbone         = require('backbone'),
    Athlete          = require('./models/athlete'),
    ClaimView        = require("./views/claimView"),
    ConfirmationView = require("./views/confirmationView");

(function() {

    var router = Backbone.Router.extend({
        routes: {
            "claim/:uid/athlete": "loadAthlete",
            "confirmation": "confirm"
        },

        loadAthlete: function(uid) {

            //Our model
            var model = new Athlete({
                id: uid
            });

            //Map model <=> view and render data on UI
            new ClaimView({
                model: model

            }).render();
        },

        confirm: function() {
            new ConfirmationView().render();
        }
    });

    //Bootstrap router and start tracking URL
    new router();

    Backbone.history.start({
        pushState: true
    });

})();
