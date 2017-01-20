var Bookshelf = require("bookshelf");

function init(connection) {
  Bookshelf.Mysql = Bookshelf.initialize({
    client: "mysql",
    connection: connection,
    debug: false
  });
}

exports.init = init;
