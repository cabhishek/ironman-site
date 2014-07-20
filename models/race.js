var Bookshelf = require('bookshelf').Mysql,
    AthleteRace = require('./athleteRace')

var Race = Bookshelf.Model.extend({
    tableName: 'races',

    hasTimestamps: ['created', 'modified'],

    athleteRace: function(){
        return this.hasMany(AthleteRace)
    }

})

module.exports = Race
