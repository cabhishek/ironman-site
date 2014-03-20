var ClaimView = require("./views/claimView"),
    Athlete = require('./models/athlete'),
    Race = require('./models/athleteRace');

(function() {

    ClaimView.init(Athlete, Race);

})();
