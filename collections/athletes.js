var Bookshelf = require('bookshelf').Mysql,
    Athlete = require('./../models/athlete')

var Athletes = Bookshelf.Collection.extend({
    model: Athlete
})

module.exports = Athletes
