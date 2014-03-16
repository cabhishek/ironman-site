var views = require('co-views'),
    settings = require('../settings');

module.exports = views(settings.PROJECT_DIR + '/www/templates', {
    map: {
        html: 'swig'
    }
});
