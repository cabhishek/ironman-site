var $        = require('jquery'),
    _        = require('underscore'),
    Backbone = require('backbone');

var Confirmation = Backbone.View.extend({
    el: '#container',

    template: _.template($('#confirmation-template').html()),

    render: function(){

        this.$el.html(this.template());
    }
});


module.exports = Confirmation;
