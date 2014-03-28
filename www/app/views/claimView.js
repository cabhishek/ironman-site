var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Validation = require('backbone-validation'),
    Stickit = require('./../../assets/js/backbone.stickit.js'),
    AthleteRace = require('./../models/athleteRace'),
    Races = require('./../races');

//JQuery dependancy
Backbone.$ = $;

var AthleteDetails = Backbone.View.extend({

    bindings: {
        '#first_name': {
            observe: 'first_name'
        },
        '#last_name': {
            observe: 'last_name'
        },
        '#email': {
            observe: 'email'
        },
    },

    template: _.template($('#details').html()),

    element: function(attr, selector) {
        return this.$('[' + selector + '=' + attr + ']');
    },

    render: function() {

        //Render races on UI
        this.$el.html(this.template(this.model.toJSON()));

        //2-way binding
        this.stickit();

        //Validation
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

    events: {
        'click .delete': 'deleteRace',
    },

    bindings: {
        '#swim_time': '_pivot_swim_time',
        '#run_time': '_pivot_run_time',
        '#cycle_time': '_pivot_cycle_time',
        '#final_time': '_pivot_final_time',
        'select#name': {
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
        'select#year': {
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

        this.years = _.map(_.range(1978, 2015), function(year) {
            return {
                "year": year
            };
        }, this).reverse();

    },

    element: function(attr, selector) {
        return this.$('[' + selector + '=' + attr + ']');
    },

    deleteRace: function(){

        this.model.destroy();

        this.remove();
    },
    render: function() {

        //UI
        this.$el.html(this.template(this.model.toJSON()));

        //2 way binding
        this.stickit();

        //Validation
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

    render: function() {

        //"this" should always be view instance
        _.bindAll(this, "renderAthlete", "addNewRace");

        //Counter to track unique races you add
        this.iterator = 10001;

        window.model = this.model;

        if (this.model.isNewAthlete()){

            //initialize with empty races
            this.model.initializeRaces();

            //Create new one empty race
            var race = new AthleteRace({
                id: this.createId()
            });

            this.model.pushRace(race);

            this.renderAthlete();

        }else{

            //Get data from server
            this.model.fetch({
                "success": this.renderAthlete
            });
        }
    },

    renderAthlete: function() {

        var details = new AthleteDetails({
            model: this.model
        });

        //Render athelete data
        $("#athlete").append(details.render().el);

        //Render race datas
        _.map(this.model.races(), this.renderRace);

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
        this.model.pushRace(race);

        this.renderRace(race);
    },

    submitForm: function(e) {

        e.preventDefault();

        if (this.model.isErrorFree()) {

            console.log("valid");
            this.model.save();

        } else {
            console.log("Not valid");
        }
    },

    createId: function() {
        return "new" + this.iterator++;
    }
});

//Expose our Main view
module.exports = ClaimView;
