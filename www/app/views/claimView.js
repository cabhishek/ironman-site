var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Validation = require('backbone-validation'),
    Stickit = require('./../../assets/js/backbone.stickit.js'),
    AthleteRace = require('./../models/athleteRace'),
    Races = require('./../races');

//JQuery dependancy
Backbone.$ = $;

window._ = _;
window.$ = $;

var AthleteDetails = Backbone.View.extend({

    bindings: {
        '#first_name': 'first_name',
        '#last_name': 'last_name',
        '#email': 'email',
    },

    template: _.template($('#details').html()),

    element: function(attr, selector) {
        return this.$('[' + selector + '=' + attr + ']');
    },

    render: function() {

        this.$el.html(this.template(this.model.toJSON()));

        this.stickit();

        Backbone.Validation.bind(this, {
            valid: function(view, attr, selector) {

                view.element(attr, selector).removeClass("error").hide();
            },
            invalid: function(view, attr, error, selector) {

                view.element(attr, selector).addClass("error").text(error).show();

            }
        });

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
        'select#race_name': {
            observe: 'name',
            selectOptions: {
                collection: 'this.races',
                labelPath: 'name',
                valuePath: 'name',
                defaultOption: {
                    label: 'Choose one...',
                    value: null
                }
            }
        },
        'select#race_year': {
            observe: 'year',
            selectOptions: {
                collection: 'this.years',
                labelPath: 'year',
                valuePath: 'year',
                defaultOption: {
                    label: 'Choose one...',
                    value: null
                }
            }
        }
    },

    template: _.template($('#row').html()),

    initialize: function() {
        this.races = Races;

        this.years = _.map(_.range(1978, 2015), function(year){
            return {"year": year};
        }, this).reverse();

    },

    element: function(attr, selector) {
        return this.$('[' + selector + '=' + attr + ']');
    },

    render: function() {

        this.$el.html(this.template(this.model.toJSON()));

        this.stickit();

        Backbone.Validation.bind(this, {
            valid: function(view, attr, selector) {

                view.element(attr + "-" + view.model.get("id"), selector).removeClass("error").hide();
            },
            invalid: function(view, attr, error, selector) {

                view.element(attr + "-" + view.model.get("id"), selector).addClass("error").text(error).show();
            }
        });

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

        //Counter to track races
        this.iterator = 10001;

        window.model = this.model;

        //Get data from server
        this.model.fetch({
            "success": this.renderAhtlete
        });
    },

    renderAhtlete: function() {

        var details = new AthleteDetails({
            model: this.model
        });

        //Render athelete data
        $("#athlete").append(details.render().el);

        var races = this.model.get('races').models;

        //Render race datas
        _.map(races, function(race) {
            this.renderRace(race);

        }, this);

        return this;
    },

    renderRace: function(race) {

        var raceRow = new RaceRow({
            model: race
        });

        $("#tblRows").append(raceRow.render().el);
    },

    addNewRace: function() {

        var race = new AthleteRace({
            id: this.createId()
        });

        //add new race row
        this.model.get("races").push(race);

        this.renderRace(race);
    },

    submitForm: function(e) {

        e.preventDefault();

        if (this.isModelValid()) {
            console.log("valid");
            this.model.save();
        } else {
            console.log("Not valid");
        }
    },

    createId: function() {
        return "new" + this.iterator++;
    },

    isModelValid: function() {
        return this.model.isValid(true) && _.every(this.model.get("races").models, function(m) {
            return m.isValid(true);
        });
    }
});

//Boot strap view.
// 1-1 mapping between view and model
// model == Athlete
module.exports = {
    init: function(model) {

        new ClaimView({
            model: model
        });
    }
};
