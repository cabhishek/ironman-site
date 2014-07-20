var db = require('./lib/dbInitialize'),
    logger = require('koa-logger'),
    router = require('koa-router'),
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

app.keys = ['your-session-secret']
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

//Mount router
app.use(router(app))

//Empty home page
app.get('/', function* index() {

    this.redirect('/landing')

    this.body = 'Redirecting to landing page'
})

//Main Landing
app.get('/landing', function* index() {
    this.body =
        yield render('landing', {
            title: 'landing'
        })
})

app.get('/fail', function* index() {
    this.body =
        yield {
            'status': 'fail'
        }
})

//Old URL paths gets redirected to landing page.
app.get('/qualifier*', function* index() {

    this.redirect('/landing')

    this.body = 'Redirecting to landing page'
})

//Load web routes
require('./auth/routes')(app)
require('./race/routes')(app)

console.log('Done loading routes')

//Boot app
app.listen(config.port)

console.log('App listening on port =>' + config.port)
