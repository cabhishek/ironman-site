var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore');

//Jquery dependancy
Backbone.$ = $;

var SearchResults = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
});

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

        new SearchResults(query);
    }

});


//Boot strap view.
module.exports = {
    init: function() {

        new SearchBox();
    }
};
