var logger = require('koa-logger'),
    router = require('koa-router'),
    route = require('koa-route'),
    serve = require('koa-static'),
    render = require('./lib/render'),
    swig = require('swig'),
    koa = require('koa');

var app = koa();

var env = process.env.NODE_ENV || 'development';

// Middleware
app.use(logger());

//Disable template caching
if ('development' === env) {
    swig.setDefaults({ cache: false });
}

app.use(route.get('/', index));

function *index() {
    this.body = yield render('index', {
        name: "Abhishek"
    });
}

app.listen(3000);
