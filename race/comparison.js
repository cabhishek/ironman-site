var _ = require('underscore'),
    render = require('./../lib/render'),
    Athlete = require('./../models/athlete'),
    Athletes = require('./../collections/athletes'),
    AthleteRace = require('./../models/athleteRace'),
    AthleteRaces = require('./../collections/athleteRaces'),
    thunkify = require('thunkify'),
    parse = require('co-body'),
    Log = require('log'),
    log = new Log('info')

exports.load = function(app) {

    function* fetchAthlete(athleteId) {

        return yield new Athlete({
            id: athleteId
        }).fetch()
    }

    function* fetchAthleteRace(raceId, athleteId) {

        return yield new AthleteRace({
            race_id: raceId,
            athlete_id: athleteId
        }).fetch()
    }

    function* getAgeGroupRaceResults(raceId, options) {
        return yield new AthleteRaces().query(function(qb) {
            qb.where({
                race_id: raceId,
                m_f: options.m_f,
                age: options.age
            }).orderBy('final_time')
        }).fetch()
    }

    function* raceAdjustedPercentile(athleteRace, raceAgeGroupResults) {
        var actuaAthleteRace = raceAgeGroupResults.get(athleteRace)
        var ageGroupRank = raceAgeGroupResults.indexOf(actuaAthleteRace)

        var totalAgeGroupFinishers = _.size(raceAgeGroupResults)

        var percentile_75 = parseInt(0.75 * totalAgeGroupFinishers)


        return parseInt(ageGroupRank / percentile_75 * 100)

    }

    app.get('/compare', function*() {

        if (_.isUndefined(this.query.athlete_id)) {

            this.body =
                yield render('comparison', {
                    status: "Missing comparison data",
                    has_query: false
                })

        } else {

            var athleteId = parseInt(this.query.athlete_id)
            var raceId = parseInt(this.query.race_id)
            var withRaceId = parseInt(this.query.with_race_id)

            var athlete =
                yield fetchAthlete(athleteId)

            var athleteRace =
                yield fetchAthleteRace(raceId, athlete.attributes.id)

            var raceAgeGroupResults =
                yield getAgeGroupRaceResults(raceId, {
                    m_f: athleteRace.attributes.m_f,
                    age: athleteRace.attributes.age
                })

            var adjPercentile = yield raceAdjustedPercentile(athleteRace, raceAgeGroupResults)

            log.info('AdjPercentile ==>' + adjPercentile)

            this.body =
                yield render('comparison', {
                    first_name: athlete.attributes.first_name,
                    last_name: athlete.attributes.last_name
                })
        }

    })
}
