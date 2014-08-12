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

var publicRoute = new Router()

require('./auth/routes')(publicRoute)
require('./race/routes').loadPublicRoutes(publicRoute)

//Index Page
publicRoute.get('/', function* index() {
    this.body =
        yield render('index', {
            title: 'index'
        })
})


publicRoute.get('/landing', function* index() {
    this.body =
        yield render('landing', {
            title: 'landing'
        })
})

publicRoute.get('/qualifier*', function* index() {

    this.redirect('/landing')

    this.body = 'Redirecting to landing page'
})


//Load publicRoute routes
app.use(publicRoute.middleware())

//Middleware Auth check
app.use(function*(next) {
    if (this.isAuthenticated()) {
        yield next
    } else {
        this.redirect('/login')
    }
})

var securedRoute = new Router()

//Load secure web routes
require('./race/routes').loadSecuredRoutes(securedRoute)

app.use(securedRoute.middleware())

console.log('Done loading routes')

//Boot app
app.listen(config.port)

console.log('App listening on port =>' + config.port)
