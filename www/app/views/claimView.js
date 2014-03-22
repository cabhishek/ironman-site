var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Athlete = require('./../models/athlete'),
    AthleteRace = require('./../models/athleteRace'),
    Stickit = require('./../../assets/js/backbone.stickit.js');

//JQuery dependancy
Backbone.$ = $;

// nicer syntax for template
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};


var AthleteDetails = Backbone.View.extend({

    bindings: {
        '#first_name': 'first_name',
        '#last_name': 'last_name',
        '#email': 'email',
    },

    template: _.template($('#details').html()),

    render: function() {

        this.$el.html(this.template(this.model.toJSON()));

        this.stickit();

        return this;
    },
});

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
        'click #add': 'addNewRace',
        'click #submit': 'submitForm'
    },

    initialize: function() {

        //"this" should always be view object
        _.bindAll(this, "renderAhtlete", "addNewRace");

        this.model.set("id", 175909);

        window.model = this.model;

        this.model.fetch({
            "success": this.renderAhtlete
        });
    },

    renderAhtlete: function() {

        var details = new AthleteDetails({
            model: this.model
        });

        $("#athlete").append(details.render().el);

        var races = this.model.get('races').models;

        _.map(races, function(race) {
            this.renderRow(race);

        }, this);

        return this;
    },

    renderRow: function(race) {

        var raceRow = new RaceRow({
            model: race
        });

        $("#tblRows").append(raceRow.render().el);
    },

    addNewRace: function() {

        var raceData = new AthleteRace();

        //add new race row
        this.model.get("races").push(raceData);

        this.renderRow(raceData);
    },

    submitForm: function(e) {

        e.preventDefault();
        this.model.save();
    }
});

//Boot strap view.
module.exports = {
    init: function() {

        new ClaimView({
            model: new Athlete()
        });
    }
};
