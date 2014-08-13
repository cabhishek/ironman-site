exports.loadPublicRoutes = function(publicRouter) {
   require('./auth').routes(publicRouter)
   require('./signup').routes(publicRouter)
}

