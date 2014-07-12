var _ = require('underscore'),
    render = require('./../lib/render'),
    Athlete = require('./../models/athlete'),
    Race = require('./../models/race'),
    AthleteRace = require('./../models/athleteRace'),
    AthleteRaces = require('./../collections/athleteRaces'),
    thunkify = require('thunkify'),
    parse = require('co-body'),
    Log = require('log'),
    log = new Log('info')

exports.load = function(app) {

    function* fetchRace(raceId) {
        return yield new Race({
            id: raceId
        }).fetch()
    }

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

    function* fetchAgeGroupRaceResults(raceId, options) {
        return yield new AthleteRaces().query(function(qb) {
            qb.where({
                race_id: raceId,
                m_f: options.m_f,
                age: options.age
            }).orderBy('final_time')
        }).fetch()
    }

    function* percentile_75(values) {
        return parseInt(0.75 * _.size(values))
    }

    function* getRank(athleteRace, raceResults) {
        return raceResults.indexOf(raceResults.get(athleteRace))
    }

    function* adjustedPercentile(athleteRace, raceAgeGroupResults) {
        var ageGroupRank =
            yield getRank(athleteRace, raceAgeGroupResults)

        var percentile =
            yield percentile_75(raceAgeGroupResults)

        return parseInt(ageGroupRank / percentile * 100)

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

            var race =
                yield fetchRace(raceId)

            var athlete =
                yield fetchAthlete(athleteId)

            var athleteRace =
                yield fetchAthleteRace(raceId, athlete.attributes.id)

            var raceAgeGroupResults =
                yield fetchAgeGroupRaceResults(raceId, {
                    m_f: athleteRace.attributes.m_f,
                    age: athleteRace.attributes.age
                })

            var race75Percentile =
                yield percentile_75(raceAgeGroupResults)

            var adjPercentile =
                yield adjustedPercentile(athleteRace, raceAgeGroupResults)

            log.info('race75Percentile ==>' + race75Percentile)
            log.info('Total Race group size ==>'+ _.size(raceAgeGroupResults))

            var withAthleteRace =
                yield fetchAthleteRace(withRaceId, athlete.attributes.id)

            var withRace =
                yield fetchRace(withRaceId)

            var withRaceAgeGroupResults =
                yield fetchAgeGroupRaceResults(withRaceId, {
                    m_f: withAthleteRace.attributes.m_f,
                    age: withAthleteRace.attributes.age
                })

            var withRace75Percentile =
                yield percentile_75(withRaceAgeGroupResults)
            var predictedWithRaceRank = parseInt(adjPercentile * withRace75Percentile / 100)

            log.info('withRace75Percentile ==>' + withRace75Percentile)
            log.info('Total With Race group size ==>'+ _.size(withRaceAgeGroupResults))


            var actualWithRaceRank =
                yield getRank(withAthleteRace, withRaceAgeGroupResults)

            this.body =
                yield render('comparison', {
                    first_name: athlete.attributes.first_name,
                    last_name: athlete.attributes.last_name,

                    actualWithRaceRank: actualWithRaceRank,
                    predictedWithRaceRank: predictedWithRaceRank,

                    raceAgeGroupWiningTime: raceAgeGroupResults.at(0).attributes.final_time,
                    withRaceAgeGroupWiningTime: withRaceAgeGroupResults.at(0).attributes.final_time,

                    race: race.toJSON(),
                    race75Percentile: race75Percentile,
                    withRace75Percentile: withRace75Percentile,

                    withRace: withRace.toJSON(),
                    athleteRace: athleteRace.toJSON(),
                    withAthleteRace: withAthleteRace.toJSON(),
                })
        }

    })
}
