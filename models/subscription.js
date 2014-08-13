var Bookshelf = require('bookshelf').Mysql,
    User = require('./user')


var Subscription = Bookshelf.Model.extend({
    tableName: 'subscription',

    hasTimestamps: ['start_date', 'created', 'modified'],

    user: function() {
        return this.hasOne(User, 'user_id')
    },

})

module.exports = Subscription
