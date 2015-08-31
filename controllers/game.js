module.exports = function(controllers) {
    var Game = require('../models/game');

    controllers.game = {

        addGame: function (req, res) {
            var game = new Game();
            game.name = req.body.name;
            game.description = req.body.description;
            game.competition = req.body.competition;
            game.type = req.body.type;
            game.moderators.push(req.user._id);
            game.players.push(req.user._id);
            game.save(function (err) {
                if (err)
                    res.json({error: err});
                else
                    res.json(game);
            });
        },

        updateGame: function (req, res) {
            Game.findById(req.body.gameId, function (err, game) {
                if (err)
                    res.send({error: err});
                else {

                    // Check that I am a moderator for this game
                    if (req.user._id == game.moderators) {
                        // Set the supplied details
                        game.name = req.body.name;
                        game.description = req.body.description;
                        game.competition = req.body.competition;
                        game.type = req.body.type;

                        // Save the game
                        game.save(function (err) {
                            if (err)
                                res.json({error: err});
                            else
                                res.json(game);
                        });
                    } else {
                        res.json({error: {message: 'Not a moderator for this game'}});
                    }
                }

            });
        },

        listAllGames: function (req, res) {
            Game.find({})
                .select('_id name description competitionId type')
                .sort({name: 1})
                .exec(function (err, games) {
                    if (err)
                        res.send({error: err});
                    else
                        res.json(games);
                });
        },

        getMyActiveGames: function (req, res) {
            Game.find({players: {$elemMatch: {userId: req.user._id.toString(), status: 'active'}}})
                .select('_id name description competitionId type')
                .sort({name: 1})
                .exec(function (err, games) {
                    if (err)
                        res.send({error: err});
                    else
                        res.json(games);
                });
        },

        addPlayer: function (req, res) {
            Game.findById(req.body.gameId, function (err, game) {
                if (err)
                    res.send({error: err});
                else {

                    // Check that I am a moderator for this game
                    if (req.user._id == game.moderators) {
                        // Add the player to the game
                        game.players.push(req.body.playerId);
                        // Save the game
                        game.save(function (err) {
                            if (err)
                                res.json({error: err});
                            else
                                res.json(game);
                        });
                    } else {
                        res.json({error: {message: 'Not a moderator for this game'}});
                    }
                }

            });
        }
    }
};
