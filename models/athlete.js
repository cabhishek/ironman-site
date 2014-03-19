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
        return this.belongsToMany(Race).through(AthleteRace).withPivot(['swim_time',  'cycle_time', 'run_time', 'final_time']);
    }
});

module.exports = Athlete;
