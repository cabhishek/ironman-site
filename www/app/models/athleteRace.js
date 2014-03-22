var Backbone = require('backbone'),
    Validation = require('backbone-validation'),
    Relational = require('./../../assets/js/backbone-relational');

var AthleteRace = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    defaults: {
        "_pivot_run_time": "",
        "_pivot_cycle_time": "",
        "_pivot_swim_time": "",
        "_pivot_final_time": ""
    },

    validation: {
        _pivot_run_time: {
            required: true,
            msg: 'Required'
        },
        _pivot_cycle_time: {
            required: true,
            msg: 'Required'
        },
        _pivot_swim_time: {
            required: true,
            msg: 'Required'
        },
        _pivot_final_time: {
            required: true,
            msg: 'Required'
        }

    },
});

module.exports = AthleteRace;
