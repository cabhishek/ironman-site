var _ = require('underscore'),
    Athlete = require('./../models/athlete'),
    AthleteRace = require('./../models/athleteRace'),
    persisAthleteRace = require('./../data/persistAthleteRace'),
    parse = require('co-body'),
    Log = require('log'),
    log = new Log('info')

// API's streaming JSON for Backone view
exports.routes = function(route) {

    route.get('/api/athlete/:uid', function*(next) {

        var athlete =
            yield new Athlete({
                id: this.params.uid
            }).fetch({
                withRelated: ['races']
            })

        if (athlete) {
            this.body = athlete.toJSON()
        } else {
            this.body = {}
        }
    })

    route.put('/api/athlete/:uid', function*(next) {

        var data =
            yield parse(this)

        var status =
            yield persisAthleteRace(data)

        console.log("Persistance Status ==>" + status.sucess)

        this.body = {
            sucess: status
        }
    })

    route.delete('/api/athleteRace/:id', function*(next) {

        console.log("Delete athlete race id ==>" + this.params.id)

        var athleteRace =
            yield new AthleteRace({
                id: this.params.id
            }).fetch()

        if (athleteRace)
            yield athleteRace.destroy()

        this.body = {
            'sucess': true
        }
    })
}
