var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    SearchResults = require('./../collections/searchResults');

//Jquery dependancy
Backbone.$ = $;


var SearchBox = Backbone.View.extend({

    el: '#search',

    template: _.template($('#searchBoxTemplate').html()),

    events: {
        'click .button': 'submit'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        return this;
    },

    submit: function() {

        var query = $("#q").val();

        var results = new SearchResults();

        //Set term to search
        results.searchTerm = query;

        results.fetch();
    }

});


//Boot strap view.
module.exports = {
    init: function() {

        new SearchBox();
    }
};
