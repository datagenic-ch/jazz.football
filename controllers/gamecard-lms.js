module.exports = function(controllers) {
    var GameCard = require('../models/gamecard-lms');
    var Fixture = require('../models/fixture');
    var Game = require('../models/game');
    var Competition = require('../models/competition');

    controllers.lms = {

        // ================================================
        // Add Last Man Standing Prediction
        // Checks to make:
        // - Data passed (gameId, week, team)
        // - GameId is valid
        // - week is valid
        // - User is playing this game
        // - Close date/time has not passed for entry
        // - Team exists in fixture
        // - User has not picked this team already in this game
        // ================================================
        addPredictionLMS: function (req, res) {
            // Get all the variables from the request
            var userId = req.user._id.toString();
            var gameId = req.body.gameId;
            var week = req.body.week;
            var team = req.body.team;

            // Check they are all valid
            if (!userId) {
                res.json({error: {message: 'User Id not present in request'}});
                return;
            }
            if (!gameId) {
                res.json({error: {message: 'Game Id not present in request'}});
                return;
            }
            if (!week) {
                res.json({error: {message: 'Fixture week not present in request'}});
                return;
            }
            if (!team) {
                res.json({error: {message: 'You need to select a team for your prediction!'}});
                return;
            }

            // Check game and fixture exist
            var game;
            var fixture;
            Game.findById(gameId, function (err, doc) {
                if (err) {
                    res.send({error: {message: 'Game not found'}});
                    return;
                }
                game = doc;
                Fixture.findOne({competitionId: game.competitionId, week: week}, function (err, doc) {
                    if (err) {
                        res.json({error: {message: 'Fixture not found'}});
                        return;
                    }
                    fixture = doc;
                    // Check the user is playing this game and their status is 'active'
                    var players = game.players;
                    var found = false;
                    var status = 'invalid';
                    for (var i = 0; i < players.length; i++) {
                        if (players[i].userId === userId.toString()) {
                            found = true;
                            status = players[i].status;
                        }
                    }
                    if (!found) {
                        res.json({error: {message: 'You are not playing this game!'}});
                        return;
                    }
                    if (status != 'active') {
                        res.json({error: {message: 'You are not active in this game!'}});
                        return;
                    }

                    // Check that the close date has not passed
                    if (Date.now() > fixture.closeDate) {
                        res.json({error: {message: 'This fixture is now closed for predictions'}});
                        return;
                    }

                    // Check the predicted team exists in the fixture
                    var matches = fixture.fixtures;
                    found = false;
                    for (i = 0; i < matches.length; i++) {
                        if (matches[i].home === team || matches[i].away === team)
                            found = true;
                    }
                    if (!found) {
                        res.json({error: {message: 'The team:' + team + ' does not exist in this fixture!'}});
                        return;
                    }

                    // Check the user has not picked this team before
                    GameCard.find({userId: userId, gameId: gameId, team: team}, function (err, docs) {
                        if (docs) {
                            if (docs.length == 1) {
                                if (docs[0].week != week) {
                                    res.json({error: {message: 'You have already picked this team before - please choose another!'}});
                                    return;
                                }
                            }
                        }

                        // Check if we have predicted this week
                        GameCard.findOne({userId: userId, gameId: gameId, week: week}, function (err, gameCard) {
                            // Save the prediction
                            if (!gameCard)
                                gameCard = new GameCard();
                            gameCard.week = week;
                            gameCard.gameId = gameId;
                            gameCard.userId = userId;
                            gameCard.team = team;
                            gameCard.save(function (err) {
                                if (err)
                                    res.json({error: err});
                                else
                                    res.json(gameCard);
                            });
                        });

                    });

                });
            });

        },

        // ================================================
        // Get team list with a flag indicating if I can select a specific team
        // Checks to make:
        // - Data passed (gameId)
        // - GameId is valid
        // - User is playing this game
        // ================================================
        getTeamList: function (req, res) {
            // Get all the variables from the request
            var userId = req.user._id;
            var gameId = req.params.gameId;

            if (!gameId) {
                res.json({error: {message: 'Game Id not present in request'}});
                return;
            }

            // Check game and fixture exist
            var game;
            Game.findById(gameId, function (err, doc) {
                if (err) {
                    res.send({error: {message: 'Game not found'}});
                    return;
                }
                game = doc;
                var competitionId = game.competitionId;

                // Get the competition
                Competition.findById(competitionId, function (err, competition) {
                    if (!err) {
                        var teams = [];
                        for (var i = 0; i < competition.teams.length; i++) {
                            teams.push({name: competition.teams[i], selected: false});
                        }
                        GameCard.find({userId: userId, gameId: gameId}, function (err, docs) {
                            for (var i = 0; i < docs.length; i++) {
                                for (var j = 0; j < teams.length; j++) {
                                    if (docs[i].team === teams[j].name && docs[i].week != competition.nextWeek)
                                        teams[j].selected = true;
                                }
                            }
                            res.json(teams);
                        });
                    }
                });
            });
        },

        getGameCards: function(req, res) {
            // Get all the variables from the request
            var userId = req.user._id.toString();
            var gameId = req.params.gameId;

            if (!gameId) {
                res.json({error: {message: 'Game Id not present in request'}});
                return;
            }

            GameCard.find({gameId:gameId, userId:userId}, function(err, docs) {
                if (err)
                    res.send({error: {message: 'Error :'+err.message}});
                else {
                    res.json(docs);
                }
            });
        }
    }
};
