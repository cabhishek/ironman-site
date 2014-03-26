var Backbone = require('backbone'),
    Validation = require('backbone-validation'),
    Relational = require('./../../assets/js/backbone-relational'),
    AthleteRace = require('./athleteRace');

var Athlete = Backbone.RelationalModel.extend({

    urlRoot: '/api/athlete/',

    idAttribute: 'id',

    defaults: {
        "id": "",
        "first_name": "",
        "last_name": "",
        "email": ""
    },

    validation: {
        first_name: {
            required: true,
            msg: 'Required'
        },
        last_name: {
            required: true,
            msg: 'Required'
        },
        email: {
            required: true,
            pattern: 'email',
            msg: 'Required'
        }
    },

    relations: [{
        type: Backbone.HasMany,
        key: 'races',
        relatedModel: AthleteRace,
    }]
});

module.exports = Athlete;
