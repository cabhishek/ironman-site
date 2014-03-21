var Backbone = require('backbone'),
    Relational = require('./../../assets/js/backbone-relational'),
    AthleteRace = require('./athleteRace');

var Athlete = Backbone.RelationalModel.extend({

    urlRoot: '/api/athlete/',

    idAttribute: 'id',

    relations: [{
        type: Backbone.HasMany,
        key: 'races',
        relatedModel: AthleteRace,
    }]
});

module.exports = Athlete;
