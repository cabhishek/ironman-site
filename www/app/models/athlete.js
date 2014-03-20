var Backbone = require('backbone');


var Athlete = Backbone.Model.extend({

    urlRoot: '/api/athlete/'
});

module.exports = Athlete;
