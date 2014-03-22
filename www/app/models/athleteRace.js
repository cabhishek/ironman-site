var Backbone = require('backbone'),
    Relational = require('./../../assets/js/backbone-relational');

var AthleteRace = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    defaults: {
        "_pivot_run_time": "",
        "_pivot_cycle_time": "",
        "_pivot_swim_time": "",
        "_pivot_final_time": ""
    }
});

module.exports = AthleteRace;
