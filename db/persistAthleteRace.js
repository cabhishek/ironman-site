var AthleteRace = require('./../models/athleteRace'),
    Athlete = require('./../models/athlete'),
    Race = require('./../models/race'),
    _ = require('underscore'),
    async = require('async'),
    Log = require('log'),
    log = new Log('info');

module.exports = function * persistAthleteRace(data) {

    var athlete = yield _getAthlete(data);

    if (athlete) {

        //E-cap
        yield athlete.save({'email': data.email}, {patch:true});

        return yield _persistAthleteRaceData(athlete, data);

    } else {

        // _createAthlete(raceData, callback);
    }

    return {
        'sucess': true
    };
};

function * _getAthlete(data) {

    var athlete = yield new Athlete({
        'first_name': data.first_name,
        'last_name': data.last_name

    }).fetch();

    if (athlete) {

        log.info("Found athlete %s %s", athlete.get('first_name'), athlete.get('last_name'));

    } else {
        log.info("Athlete not found %s %s", data.first_name, data.last_name);
    }

    return athlete;
}

function * _getRace(raceData) {
    log.info("getting race data for =>" + raceData.name + " -- " + raceData.year);

    return yield new Race({
        name: raceData.name,
        year: raceData.year,

    }).fetch();

}

// function _createAthlete(raceData, callback) {

//     Athlete.forge({
//         first_name: raceData.firstName,
//         last_name: raceData.lastName,
//         athlinks_id: raceData.athlinksId,

//     }).save().then(function(athlete) {
//         log.info("Created athlete %s %s %s", raceData.athlinksId, raceData.firstName, raceData.lastName);

//         _persistAthleteRaceData(athlete, raceData, callback);
//     }).
//     catch (function(e) {
//         log.info(e.message);

//         callback();
//     });
// }

function * persist(race) {

    var ironmanRace = yield _getRace(race);

    if (ironmanRace) {
        log.info("Ironman race id =>" + ironmanRace.id);

        var athleteRace = yield new AthleteRace({
                'id': race._pivot_id
        }).fetch();

        data = {
            swim_time: race._pivot_swim_time,
            run_time: race._pivot_run_time,
            cycle_time: race._pivot_cycle_time,
            final_time: race._pivot_final_time
        };

        if (athleteRace){
            yield athleteRace.save(data, {patch: true});

        }else{
            //create a new record

            _.extend(data, {
                athlete_id: race.athlete_id,
                race_id: ironmanRace.id,
            });

            yield AthleteRace.forge(data).save();
        }

} else {
    log.info("Race not found");
}

return true;
}

function * _persistAthleteRaceData(athlete, data) {

    log.info("-- Inside _persistAthleteRaceData --");

    // Add athlete_id since we save race data in parallel
    _.each(data.races, function(race) {
        _.extend(race, {
            'athlete_id': athlete.get('id')
        });
    });

    yield data.races.map(persist);

    return {
        'sucess': true
    };
}
