var Backbone = require('backbone'),
    Athlete = require('./models/athlete'),
    ClaimView = require("./views/claimView");

(function() {

    var router = Backbone.Router.extend({
        routes: {
            "claim/:uid/athlete": "loadAthlete",
            "confirm": "confirm"
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

        confirm: function(){
            alert("confirm");
        }
    });

     //Bootstrap router and start tracking URL
    var r = new router();

    window.r = r;

    Backbone.history.start({
        pushState: true
    });

})();
