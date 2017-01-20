var Bookshelf = require("bookshelf").Mysql, bcrypt = require("bcrypt");

var User = Bookshelf.Model.extend({
  tableName: "user",
  hasTimestamps: [ "created", "modified" ],
  isValid: function(email, rawPassword) {
    return this.attributes.email == email &&
      bcrypt.compareSync(rawPassword, this.attributes.password);
  }
});

module.exports = User;
