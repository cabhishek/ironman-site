exports = module.exports = function(app) {
    require('./claim').routes(app)
    require('./comparison').routes(app)
    require('./search').routes(app)
    require('./api').routes(app)
}
