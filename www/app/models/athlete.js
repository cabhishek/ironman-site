var Backbone = require('backbone'),
    Validation = require('backbone-validation'),
    Relational = require('./../../assets/js/backbone-relational'),
    AthleteRace = require('./athleteRace');

var Athlete = Backbone.RelationalModel.extend({

    urlRoot: '/api/athlete/',

    idAttribute: 'id',

    defaults: {
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

    isNewAthlete: function(){
        return this.id == 'new';
    },

    initializeRaces: function(){
        this.set("races", []);
    },

    races: function(){
        return this.get("races").models;
    },

    pushRace: function(race){
        this.get("races").push(race);

        return this;
    },

    relations: [{
        type: Backbone.HasMany,
        key: 'races',
        relatedModel: AthleteRace,
    }]
});

module.exports = Athlete;
