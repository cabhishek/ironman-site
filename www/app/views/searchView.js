var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    SearchResults = require('./../collections/searchResults');

//Jquery dependancy
Backbone.$ = $;

var ResultsView = Backbone.View.extend({

    el: '#tblRows',

    template: _.template($('#raceDataTemplate').html()),

    initialize: function() {
        this.collection.on('add', this.render, this);
    },

    render: function(raceData) {
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
