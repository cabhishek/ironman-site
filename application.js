var logger = require('koa-logger'),
    router = require('koa-router'),
    serve = require('koa-static'),
    render = require('./lib/render'),
    swig = require('swig'),
    koa = require('koa');

var app = koa();

var env = process.env.NODE_ENV || 'development';

// Middleware
app.use(logger());

//Disable template caching on dev env
if ('development' === env) {
    swig.setDefaults({
        cache: false
    });
}

//Mount router
app.use(router(app));

//Index page
app.get('/', function * index() {
    this.body = yield render('index', {
        name: "Abhishek"
    });
});

//Load race app
require('./race/index').load(app);

app.listen(3000);
