var path = require('path'),
    settings = require('./settings'),
    projectRoot = path.resolve(settings.PROJECT_DIR),
    isProduction = process.env.NODE_ENV === "production"

console.log("NODE_ENV =>" + process.env.NODE_ENV)

var liveDB = {
    host     : 'datathletics-db-live.cc3tkob2sz1n.us-west-2.rds.amazonaws.com',
    user     : 'datathletics',
    database : 'datathleticsdb',
    password : 'F00lF00l!',
    charset  : 'utf8'
}

var localDB = {
    host: '127.0.0.1',
    user: 'root',
    database: 'datathletics',
    charset: 'utf8'
}

//Swig + Consolidate ulginess
var templateOptions = function() {
    if (isProduction) {
        return {
            map: {
                html: 'swig'
            },
            cache: "memory"
        }
    } else {

        return {
            map: {
                html: 'swig'
            },
            cache: false
        }
    }
}()

var staticDir = function() {
    var assetsDir = "/www/assets"

    if (isProduction) {
        // All minifed, compressed and gzipped assets are packaged
        // and stored in build folder. Structure mimics www/assets
        assetsDir = "/www/build"
    }

    return path.resolve(projectRoot + assetsDir)
}()

var dbString = function() {
    return isProduction ? liveDB : localDB
}()

//Base configs for Site
var config = {
    env              : process.env.NODE_ENV || 'development',
    port             : process.env.PORT || 3000,
    staticDir        : staticDir,
    templateDir      : path.resolve(projectRoot + "/www/templates"),
    templateOptions  : templateOptions,
    browserifyDebug  : !isProduction,
    isProduction     : isProduction,
    projectRoot      : projectRoot,
    title            : "Data Athletics",
    sessionKey       : ['datathletics-is-awesome'],
    db               : {
        'connection' : dbString
    }
}

module.exports = config
