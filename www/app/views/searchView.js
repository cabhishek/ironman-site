var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    SearchResults = require('./../collections/searchResults');

//Jquery dependancy
Backbone.$ = $;

var ResultsView = Backbone.View.extend({

    el: '#results',

    template: _.template($('#raceDataTemplate').html()),

    athleteNotFound: _.template($('#athleteNotFound').html()),

    initialize: function() {
        this.collection.on('add', this.render, this);
    },

    render: function(raceData) {

        if (!raceData.get('found')){
            alert("Failure");
            alert(raceData.get('errorMsg'));

            this.$el.append(this.athleteNotFound(raceData.toJSON()));

            return this;
        }

        alert("Success");
        this.$el.append(this.template(raceData.toJSON()));

        return this;
    }
});

var SearchBox = Backbone.View.extend({

    el: '#search',

    template: _.template($('#searchBoxTemplate').html()),

    events: {
        'keypress #q' : 'submitOnEnter',
        'click #btn'  : 'submit'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        return this;
    },

    submitOnEnter: function(e){
        if (e.keyCode != 13) return;

        this.submit(e);
    },

    submit: function(e) {

        e.preventDefault();

        var query = $("#q").val();

        var results = new SearchResults();

        results.search(query);

        //Display results
        new ResultsView({
            collection: results
        });
    }

});


//Boot strap view.
module.exports = {
    init: function() {

        new SearchBox();
    }
};
