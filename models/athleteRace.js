var Bookshelf = require('bookshelf').Mysql
    Race = require('./race')

var AthleteRace = Bookshelf.Model.extend({
    tableName: 'athlete_races',

    hasTimestamps: ['created', 'modified'],

    race: function(){
        return this.belongsTo(Race, 'race_id')
    }

})

module.exports = AthleteRace
