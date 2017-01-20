exports.loadPublicRoutes = function(publicRouter) {
  require("./claim").routes(publicRouter);
  require("./search").routes(publicRouter);
  require("./api").routes(publicRouter);
};

exports.loadSecuredRoutes = function(securedRouter) {
  require("./comparison").routes(securedRouter);
};
