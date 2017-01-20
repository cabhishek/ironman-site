var Backbone = require("backbone"),
  Validation = require("backbone-validation"),
  Relational = require("./../../assets/js/backbone-relational");

var AthleteRace = Backbone.RelationalModel.extend({
  urlRoot: "/api/athleteRace/",
  idAttribute: "_pivot_id",
  defaults: {
    id: "",
    _pivot_run_time: "",
    _pivot_cycle_time: "",
    _pivot_swim_time: "",
    _pivot_final_time: ""
  },
  validation: {
    _pivot_run_time: { required: true, msg: "Required" },
    _pivot_cycle_time: { required: true, msg: "Required" },
    _pivot_swim_time: { required: true, msg: "Required" },
    _pivot_final_time: { required: true, msg: "Required" },
    name: { required: true },
    year: { required: true }
  }
});

module.exports = AthleteRace;
