var views = require("co-views"), config = require("../config");

module.exports = views(config.templateDir, config.templateOptions);
