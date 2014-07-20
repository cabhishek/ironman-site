var Bookshelf = require('bookshelf').Mysql

var User = Bookshelf.Model.extend({
    tableName: 'user',

    hasTimestamps: ['created', 'modified'],
});

module.exports = User;
