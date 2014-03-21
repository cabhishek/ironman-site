var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Athlete = require('./../models/athlete'),
    AthleteRace = require('./../models/athleteRace'),
    Stickit = require('./../../assets/js/backbone.stickit.js');

//Jquery dependancy
Backbone.$ = $;

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var RaceRow = Backbone.View.extend({

    tagName: "tr",

    bindings: {
        '#swim_time': '_pivot_swim_time',
        '#run_time': '_pivot_run_time',
        '#cycle_time': '_pivot_cycle_time',
        '#final_time': '_pivot_final_time',
    },

    template: _.template($('#row').html()),

    render: function() {

        this.$el.html(this.template(this.model.toJSON()));

        this.stickit();

        return this;
    },
});


var ClaimView = Backbone.View.extend({

    el: "#container",

    events: {
        'click #add': 'addNewRaceData'
    },

    initialize: function() {

        this.model = new Athlete({
            id: 175909
        });

        window.model = this.model;

        this.model.fetch();

        this.listenTo(this.model, 'change', this.renderRaceData);
    },

    renderRaceData: function() {

        //Ugly as hell
        var races = this.model.get('races').models;

        _.map(races, function(race) {

            this.renderRaceRow(race);

        }, this);

        return this;
    },

    renderRaceRow: function(race){

        var raceRow = new RaceRow({
            model: race
        });

        $("#tblRows").append(raceRow.render().el);
    },

    addNewRaceData: function(){

        var raceData = new AthleteRace().set({
            "_pivot_swim_time": 0,
            "_pivot_run_time": 0,
            "_pivot_cycle_time": 0,
            "_pivot_final_time": 0
        });

        //add new race row
        this.model.get("races").push(raceData);

        this.renderRaceRow(raceData);
    }
});

//Boot strap view.
module.exports = {
    init: function() {

        new ClaimView();
    }
};
