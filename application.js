var db = require('./lib/dbInitialize')(),
    logger = require('koa-logger'),
    router = require('koa-router'),
    serve = require('koa-static'),
    render = require('./lib/render'),
    swig = require('swig'),
    koa = require('koa');

var app = koa();

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

// Logging Middleware
app.use(logger());

//Static files
app.use(serve('www/assets'));

//Disable template caching on dev
if ('development' === env) {
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

app.listen(port);
console.log('app listening on port ' + port);
