var _            = require('underscore'),
    render       = require('./../lib/render'),
    Athlete      = require('./../models/athlete'),
    Race         = require('./../models/race'),
    AthleteRace  = require('./../models/athleteRace'),
    AthleteRaces = require('./../collections/athleteRaces'),
    ageGroups    = require('./../data/ageGroups'),
    Log          = require('log'),
    log          = new Log('info')


function* _fetchRace(raceId) {
    return yield new Race({
        id: raceId
    }).fetch()
}

function* _fetchAthlete(athleteId) {

    return yield new Athlete({
        id: athleteId
    }).fetch()
}

function* _fetchAthleteRace(raceId, athleteId) {

    return yield new AthleteRace({
        race_id: raceId,
        athlete_id: athleteId
    }).fetch()
}

function* _fetchAgeGroupRaceResults(raceId, options) {

    var athleteAgeGroup = _.first(_.filter(ageGroups, function(ageGroup) {
        if (options.age >= ageGroup.min_age && options.age <= ageGroup.max_age)
            return ageGroup;
    }));

    log.info('athleteAgeGroup =>' + athleteAgeGroup.min_age + '-' + athleteAgeGroup.max_age)

    return yield new AthleteRaces().query(function(qb) {
        qb.where({
            race_id: raceId,
            m_f: options.m_f
        }).whereBetween('age', [athleteAgeGroup.min_age, athleteAgeGroup.max_age]).orderBy('final_time')
    }).fetch()
}

function _percentile_75(values) {
    return parseInt(0.75 * _.size(values))
}

function _rank(athleteRaceResult, raceResults) {
    return raceResults.indexOf(raceResults.get(athleteRaceResult)) + 1
}

function _adjustedPercentile(athleteRaceResult, athleteAgeGroupRaceFinishers) {
    var ageGroupRank =
        _rank(athleteRaceResult, athleteAgeGroupRaceFinishers)

    var percentile =
        _percentile_75(athleteAgeGroupRaceFinishers)

    return parseInt(ageGroupRank / percentile * 100)

}

exports.routes = function(route) {

    route.get('/compare', function*() {
        if (_.isUndefined(this.query.athlete_id)) {

            this.body =
                yield render('comparison', {
                    status: 'Missing comparison data',
                    has_query: false
                })

        } else {

            var athleteId = parseInt(this.query.athlete_id)
            var raceId = parseInt(this.query.race_id)
            var comparedRaceId = parseInt(this.query.with_race_id)

            var race =
                yield _fetchRace(raceId)

            var athlete =
                yield _fetchAthlete(athleteId)

            var athleteRaceResult =
                yield _fetchAthleteRace(raceId, athlete.attributes.id)

            var athleteAgeGroupRaceFinishers =
                yield _fetchAgeGroupRaceResults(raceId, {
                    m_f: athleteRaceResult.attributes.m_f,
                    age: athleteRaceResult.attributes.age
                })

            var adjPercentile =
                _adjustedPercentile(athleteRaceResult, athleteAgeGroupRaceFinishers)

            var raceAgeGroupRank =
                _rank(athleteRaceResult, athleteAgeGroupRaceFinishers)

            log.info('Total Race group size ==>' + _.size(athleteAgeGroupRaceFinishers))
            log.info('athleteRaceResult.attributes.age ==>' + athleteRaceResult.attributes.age)
            log.info('adjPercentile ==>' + adjPercentile)

            var comparedAthleteRaceResult =
                yield _fetchAthleteRace(comparedRaceId, athlete.attributes.id)

            var comparedRace =
                yield _fetchRace(comparedRaceId)

            var athleteAgeGroupComparedRaceFinishers =
                yield _fetchAgeGroupRaceResults(comparedRaceId, {
                    m_f: comparedAthleteRaceResult.attributes.m_f,
                    age: comparedAthleteRaceResult.attributes.age
                })

            var athleteComparedRaceAgeGroup75Percentile =
                _percentile_75(athleteAgeGroupComparedRaceFinishers)

            var predictedRaceRank = parseInt(adjPercentile * athleteComparedRaceAgeGroup75Percentile / 100)

            var comparedRaceAgeGroupRank =
                _rank(comparedAthleteRaceResult, athleteAgeGroupComparedRaceFinishers)

            log.info('Total With Race group size ==>' + _.size(athleteAgeGroupComparedRaceFinishers))
            log.info('comparedAthleteRaceResult.attributes.age ==>' + comparedAthleteRaceResult.attributes.age)

            var actualComparedRaceRank =
                _rank(comparedAthleteRaceResult, athleteAgeGroupComparedRaceFinishers)

            log.info('actualComparedRaceRank ==>' + actualComparedRaceRank)
            log.info('predictedRaceRank ==>' + predictedRaceRank)

            var predictedTime = athleteAgeGroupComparedRaceFinishers.at(predictedRaceRank).attributes.final_time

            this.body =
                yield render('comparison', {
                    first_name: athlete.attributes.first_name,
                    last_name: athlete.attributes.last_name,

                    raceAgeGroupWiningTime: athleteAgeGroupRaceFinishers.at(0).attributes.final_time,
                    comparedRaceAgeGroupWiningTime: athleteAgeGroupComparedRaceFinishers.at(0).attributes.final_time,

                    race: race.toJSON(),
                    raceAgeGroupRank: raceAgeGroupRank,
                    raceAgeGroupPercentile: parseInt(raceAgeGroupRank / _.size(athleteAgeGroupRaceFinishers) * 100),

                    comparedRace: comparedRace.toJSON(),
                    comparedRaceAgeGroupRank: comparedRaceAgeGroupRank,
                    comparedRaceAgeGroupPercentile: parseInt(comparedRaceAgeGroupRank / _.size(athleteAgeGroupComparedRaceFinishers) * 100),
                    predictedTime: predictedTime,

                    athleteRaceResult: athleteRaceResult.toJSON(),
                    comparedAthleteRaceResult: comparedAthleteRaceResult.toJSON(),

                    raceAgeGroup10Percentile: athleteAgeGroupRaceFinishers.at(parseInt(_.size(athleteAgeGroupRaceFinishers) * 0.10)).attributes.final_time,
                    comparedRaceAgeGroup10Percentile: athleteAgeGroupComparedRaceFinishers.at(parseInt(_.size(athleteAgeGroupComparedRaceFinishers) * 0.10)).attributes.final_time
                })
        }
    })
}
