var _ = require('underscore'),
    render = require('./../lib/render'),
    Athletes = require('./../collections/athletes'),
    Log = require('log'),
    log = new Log('info')

exports.routes = function(app) {
    app.get('/search', function*() {

        if (_.isUndefined(this.query.q)) {
            this.body =
                yield render('search', {
                    title: "Search",
                    has_query: false
                })
        } else {

            var names = this.query.q.split(' ')

            var firstName = _.first(names)
            var lastName = _.rest(names, 1).join(' ')

            var where_clause = {
                'first_name': firstName
            }

            if (!_.isEmpty(lastName)) {
                _.extend(where_clause, {
                    'last_name': lastName
                })
            }

            var athletes =
                yield new Athletes().query({
                    'where': where_clause
                }).fetch({
                    withRelated: ['races']
                })

            this.body =
                yield render('raceResults', {
                    found: _.size(athletes) > 0,
                    total: _.size(athletes),
                    athletes: athletes.toJSON()
                })
        }

    })
}
