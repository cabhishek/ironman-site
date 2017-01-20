var AthleteRace = require("./../models/athleteRace"),
  Athlete = require("./../models/athlete"),
  Race = require("./../models/race"),
  _ = require("underscore"),
  Log = require("log"),
  log = new Log("info");

module.exports = function* persistAthleteRace(data) {
  var athlete = yield _fetchAthlete(data);

  if (athlete) {
    log.info(
      "Found athlete %s %s",
      athlete.get("first_name"),
      athlete.get("last_name")
    );

    //E-cap
    yield athlete.save(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      },
      { patch: true }
    );

    return yield _persistAthleteRaceData(athlete, data);
  } else {
    log.info(
      "Athlete %s %s not found.. So creating one.",
      data.first_name,
      data.last_name
    );

    return yield _createAthlete(data);
  }
};

function* _fetchAthlete(data) {
  var athlete = yield new Athlete({ id: data.id }).fetch();

  return athlete;
}

function* _fetchRace(raceData) {
  log.info("Getting race data for =>%s--%s", raceData.name, raceData.year);

  return yield new Race({ name: raceData.name, year: raceData.year }).fetch();
}

function* _createAthlete(data) {
  var athlete = yield Athlete
    .forge({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email
    })
    .save();

  //Now go save races for that athlete
  return yield _persistAthleteRaceData(athlete, data);
}

function* _persistAthleteRaceData(athlete, data) {
  // Add athlete_id since we save race data in parallel
  _.each(data.races, function(race) {
    _.extend(race, { athlete_id: athlete.get("id") });
  });

  yield data.races.map(persist);

  return { sucess: true };
}

function* persist(race) {
  var ironmanRace = yield _fetchRace(race);

  if (!ironmanRace) {
    var qualifier = yield new Race({ name: race.name }).fetch();

    log.info(
      "Race not found, so creating new one =>" + race.name + " " + race.year
    );

    ironmanRace = yield Race
      .forge({
        name: race.name,
        year: race.year,
        qualifier_id: qualifier.attributes.qualifier_id,
        race_type: qualifier.attributes.race_type,
        month: qualifier.attributes.month,
        type: qualifier.attributes.race_type == "Ironman" ? 0 : 1
      })
      .save();
  }

  log.info("Ironman race id =>" + ironmanRace.id);

  var athleteRace = yield new AthleteRace({ id: race._pivot_id }).fetch();

  data = {
    swim_time: race._pivot_swim_time,
    run_time: race._pivot_run_time,
    cycle_time: race._pivot_cycle_time,
    final_time: race._pivot_final_time
  };

  if (athleteRace) {
    yield athleteRace.save(data, { patch: true });
  } else {
    //create a new record
    _.extend(data, { athlete_id: race.athlete_id, race_id: ironmanRace.id });

    yield AthleteRace.forge(data).save();
  }

  return true;
}
