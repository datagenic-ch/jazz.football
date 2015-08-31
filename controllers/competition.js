module.exports = function(controllers) {
    var Competition = require('../models/competition');
    var debug = require('debug')('jazz.football:routes/controllers');

    controllers.competition = {

        getCompetitions: function (req, res) {
            Competition.find({}, function (err, competitions) {
                if (err)
                    res.json({error: err});
                else
                    res.json(competitions);
            })
        },

        getCompetition: function (req, res) {
            var competitionId = req.params.competitionId;
            Competition.findById(competitionId, function (err, competition) {
                if (err)
                    res.json({error: err});
                else
                    res.json(competition);
            })
        }
    }

};