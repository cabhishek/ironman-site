var db = require('./lib/dbInitialize'),
    logger = require('koa-logger'),
    router = require('koa-router'),
    serve = require('koa-static'),
    render = require('./lib/render'),
    swig = require('swig'),
    koa = require('koa'),
    config = require('./config');

var app = koa();

console.log("Connecting to DB =>" + config.db.connection.host);

//connect to DB
db.init(config.db.connection);

// Logging Middleware
app.use(logger());

//Static files
app.use(serve(config.staticDir));

//Disable template caching on dev
if (!config.isProduction) {
    swig.setDefaults({
        cache: false
    });
}

//Mount router
app.use(router(app));

//Home page
app.get('/', function * index() {
    this.body = yield render('index', {
        name: "Abhishek"
    });
});

app.get('/landing', function * index() {
    this.body = yield render('landing', {
        title: "landing"
    });
});

//Load Race app
require('./race/index').load(app);

//Boot app
app.listen(config.port);

console.log('App listening on port ' + config.port);
