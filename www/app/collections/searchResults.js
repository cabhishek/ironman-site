var Backbone = require('backbone');


var SearchResults = Backbone.Collection.extend({

    url: function(){
        return "api/search/" + this.searchTerm;
    },

    search: function(searchTerm){
        this.searchTerm = searchTerm;
        this.fetch();
    }

});

module.exports = SearchResults;
