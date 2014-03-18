var Bookshelf = require('bookshelf').Mysql,
    AthleteRace = require('./athleteRace'),
    Race = require('./race');


var Athlete = Bookshelf.Model.extend({
    tableName: 'athletes',

    hasTimestamps: ['created', 'modified'],


    athleteRaces: function(){
        return this.hasMany(AthleteRace, 'athlete_id');
    },

    races: function() {
        // return this.belongsToMany(Race, 'athlete_races_2', 'athlete_id', 'race_id').withPivot(['ago', 'm_f']);

        return this.belongsToMany(Race).through(AthleteRace).withPivot(['ago', 'm_f']);

    }

});

module.exports = Athlete;
