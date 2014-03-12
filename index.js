var logger = require('koa-logger'),
    router = require('koa-router'),
    route = require('koa-route'),
    serve = require('koa-static'),
    render = require('./lib/render'),
    koa = require('koa');

var app = koa();

// Middleware
app.use(logger());

app.use(route.get('/', index));

function *index() {
    this.body = yield render('index', {
        name: "Abhishek"
    });
}

app.listen(3000);
