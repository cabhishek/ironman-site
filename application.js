var db = require('./lib/dbInitialize'),
    logger = require('koa-logger'),
    Router = require('koa-router'),
    serve = require('koa-static'),
    staticCache = require('koa-static-cache'),
    render = require('./lib/render'),
    swig = require('swig'),
    koa = require('koa'),
    config = require('./config'),
    bodyParser = require('koa-bodyparser'),
    passport = require('koa-passport'),
    session = require('koa-session')

var app = koa()

console.log('Connecting to DB =>' + config.db.connection.host)
console.log('Env isProduction =>' + config.isProduction)

app.keys = config.sessionKey

app.use(session())
app.use(passport.initialize())
app.use(passport.session())


//connect to DB
db.init(config.db.connection)

// Logging Middleware
app.use(logger())
app.use(bodyParser())

//Disable template caching on dev
if (!config.isProduction) {
    swig.setDefaults({
            cache: false
        })
        //Static files
    app.use(serve(config.staticDir))
} else {
    app.use(staticCache(config.staticDir, {
        maxAge: 365 * 24 * 60 * 60
    }))
}

var public = new Router()

require('./auth/routes')(public)

//Load public routes
app.use(public.middleware())

//Middleware Auth check
app.use(function*(next) {
    if (this.isAuthenticated()) {
        yield next
    } else {
        this.redirect('/login')
    }
})

var secured = new Router()

//Empty home page
secured.get('/', function* index() {
    this.redirect('/landing')
})

secured.get('/landing', function* index() {
    this.body =
        yield render('landing', {
            title: 'landing'
        })
})

secured.get('/qualifier*', function* index() {

    this.redirect('/landing')

    this.body = 'Redirecting to landing page'
})

//Load secure web routes
require('./race/routes')(secured)

app.use(secured.middleware())

console.log('Done loading routes')

//Boot app
app.listen(config.port)

console.log('App listening on port =>' + config.port)
