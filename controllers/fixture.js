module.exports = function(controllers) {
    var Fixture = require('../models/fixture');
    var Competition = require('../models/competition');

    controllers.fixtures = {

        getFixtures: function (req, res) {
            var competitionId = req.params.competitionId;
            Fixture.find({competitionId: competitionId}, function (err, fixtures) {
                if (err)
                    res.json({error: err});
                else
                    res.json(fixtures);
            })
        },

        getNextFixture: function (req, res) {
            var competitionId = req.params.competitionId;
            Competition.findById(competitionId, function (err, competition) {
                if (err)
                    res.json({error: err});
                else {
                    Fixture.findOne({
                        competitionId: competitionId,
                        week: competition.nextWeek
                    }, function (err, fixture) {
                        if (err)
                            res.json({error: err});
                        else
                            res.json(fixture);
                    })
                }
            })

        }
    }
};