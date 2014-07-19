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

require('./auth/auth')

var app = koa();

console.log("Connecting to DB =>" + config.db.connection.host);
console.log("Env isProduction =>" + config.isProduction);

app.keys = ['your-session-secret']
app.use(session())

app.use(passport.initialize())
app.use(passport.session())


//connect to DB
db.init(config.db.connection);

// Logging Middleware
app.use(logger());
app.use(bodyParser())

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
app.get('/', function* index() {

    this.redirect('/landing');

    this.body = 'Redirecting to landing page';
});

//Main Landing
app.get('/landing', function* index() {
    this.body =
        yield render('landing', {
            title: "landing"
        });
});

app.get('/login', function* index() {
    this.body =
        yield render('login', {
            greetings: "Hello User"
        });
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/fail'
    })
)

app.get('/success', function* index() {
    this.body =
        yield {
            'status': 'success'
        }
});

app.get('/fail', function* index() {
    this.body =
        yield {
            'status': 'fail'
        }
});


//Old URL paths gets redirected to landing page.
app.get('/qualifier*', function* index() {

    this.redirect('/landing');

    this.body = 'Redirecting to landing page';
});

//Load Race app
require('./race/index').load(app);

//Load race comparison app
require('./race/comparison').load(app);

//Boot app
app.listen(config.port);

console.log('App listening on port ' + config.port);
