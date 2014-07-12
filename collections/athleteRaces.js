var Bookshelf = require('bookshelf').Mysql,
    AthleteRace = require('./../models/athleteRace');

var AthleteRaces = Bookshelf.Collection.extend({
    model: AthleteRace
});

module.exports = AthleteRaces;
