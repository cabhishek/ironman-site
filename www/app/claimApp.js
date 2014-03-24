var Backbone = require('backbone'),
    Athlete = require('./models/athlete'),
    ClaimView = require("./views/claimView");

(function() {

    var router = Backbone.Router.extend({
        routes: {
            "claim/:uid/athlete": "loadAthlete",
        },

        loadAthlete: function(uid) {

            var model = new Athlete({
                id: uid
            });

            ClaimView.init(model);
        }
    });

     //Bootstrap
    new router();

    Backbone.history.start({
        pushState: true
    });

})();
