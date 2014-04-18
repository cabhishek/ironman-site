var db = require('./lib/dbInitialize'),
    logger = require('koa-logger'),
    router = require('koa-router'),
    serve = require('koa-static'),
    staticCache = require('koa-static-cache'),
    render = require('./lib/render'),
    swig = require('swig'),
    koa = require('koa'),
    config = require('./config');

var app = koa();

console.log("Connecting to DB =>" + config.db.connection.host);
console.log("Env isProduction =>" + config.isProduction);

//connect to DB
db.init(config.db.connection);

// Logging Middleware
app.use(logger());


//Disable template caching on dev
if (!config.isProduction) {
    swig.setDefaults({
        cache: false
    });
    //Static files
    app.use(serve(config.staticDir));
} else {
    app.use(staticCache(config.staticDir, {
        maxAge: 365 * 24 * 60 * 60
    }));
}

//Mount router
app.use(router(app));

//Empty home page
app.get('/', function * index() {

    this.redirect('/landing');

    this.body = 'Redirecting to landing page';
});

//Main Landing
app.get('/landing', function * index() {
    this.body = yield render('landing', {
        title: "landing"
    });
});

//Old URL paths gets redirected to landing page.
app.get('/qualifier*', function * index() {

    this.redirect('/landing');

    this.body = 'Redirecting to landing page';
});

//Load Race app
require('./race/index').load(app);

//Boot app
app.listen(config.port);

console.log('App listening on port ' + config.port);
