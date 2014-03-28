var path = require('path'),
    settings = require('./settings');

var projectRoot = path.resolve(settings.PROJECT_DIR);

var isProduction = process.env.NODE_ENV === "production";

var liveDB = {
    host: 'datathletics-db-live.cc3tkob2sz1n.us-west-2.rds.amazonaws.com',
    user: 'datathletics',
    database: 'datathleticsdb',
    password: 'F00lF00l!',
    charset: 'utf8'
};

var localDB = {
    host: '127.0.0.1',
    user: 'root',
    database: 'datathletics',
    charset: 'utf8'
};

//Base
var config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    staticDir: path.resolve(projectRoot + "/www/assets"),
    browserifyDebug: !isProduction,
    isProduction: isProduction,
    projectRoot: projectRoot,
    title: "Data Athletics"
};

//DB
config.db = {
    'connection': (function() {
        return isProduction ? liveDB : localDB;
    })()
};

module.exports = config;
