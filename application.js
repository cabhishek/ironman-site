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
    session = require('koa-session'),
    Log = require('log'),
    log = new Log('info')

var app = koa()

log.info('Assets dir =>%s', config.staticDir)
log.info('Connecting to DB =>%s', config.db.connection.host)
log.info('Node_Env isProduction =>%s', config.isProduction)

app.keys = config.sessionKey

app.use(session())
app.use(passport.initialize())
app.use(passport.session())


//Connect to DB
db.init(config.db.connection)

//Logging Middleware
app.use(logger())
app.use(bodyParser())

//Disable template caching on dev
if (!config.isProduction) {
    log.info("Disabled caching static contents")

    swig.setDefaults({
        cache: false
    })
    app.use(serve(config.staticDir))
} else {
    log.info("Caching static contents")

    app.use(staticCache(config.staticDir, {
        maxAge: 365 * 24 * 60 * 60,
        gzip: true
    }))
}

var publicRoute = new Router()

//All public web routes start below
require('./auth/routes').loadPublicRoutes(publicRoute)
require('./race/routes').loadPublicRoutes(publicRoute)

//Index Page
publicRoute.get('/', function * index() {
    this.body =
        yield render('overview', {
            title: 'index'
        })
})

publicRoute.get('/landing', function * index() {
    this.redirect('/')
})

publicRoute.get('/qualifier*', function * index() {

    this.redirect('/')

    this.body = 'Redirecting to landing page'
})

//Mount public web routes
app.use(publicRoute.middleware())

//Middleware Auth check
app.use(function * (next) {
    if (this.isAuthenticated()) {
        yield next
    } else {
        this.redirect('/login')
    }
})

var securedRoute = new Router()

//All secure web routes
require('./race/routes').loadSecuredRoutes(securedRoute)

app.use(securedRoute.middleware())

log.info('Done loading routes')

//Boot app
app.listen(config.port)

log.info('App listening on port =>%s', config.port)
