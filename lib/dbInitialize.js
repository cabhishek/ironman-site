var Bookshelf = require('bookshelf');

function init(){
    Bookshelf.Mysql = Bookshelf.initialize({
        client: 'mysql',

        connection: {
            host: '127.0.0.1',
            user: 'root',
            database: 'datathletics',
            charset: 'utf8'
        },

        debug: true
    });
}

module.exports = init;
