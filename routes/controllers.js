module.exports = function(app, controllers) {
    // =====================================
    // PROFILE INFORMATION
    // =====================================
    app.get('/api/profile', isLoggedIn, controllers.user.getProfile);
    app.put('/api/profile', isLoggedIn, controllers.user.updateProfile);

    // =====================================
    // GAME MANAGEMENT
    // =====================================
    app.get('/api/game',isLoggedIn, controllers.game.listAllGames);
    app.get('/api/game/active',isLoggedIn, controllers.game.getMyActiveGames);
    app.post('/api/game', isLoggedIn, controllers.game.addGame);
    app.post('/api/game/player', isLoggedIn, controllers.game.addPlayer);

    // =====================================
    // PREDICTION MANAGEMENT
    // =====================================
    app.get('/api/competition', isLoggedIn, controllers.competition.getCompetitions);
    app.get('/api/competition/:competitionId', isLoggedIn, controllers.competition.getCompetition);
    app.get('/api/competition/:competitionId/fixtures', isLoggedIn, controllers.fixtures.getFixtures);
    app.get('/api/competition/:competitionId/next', isLoggedIn, controllers.fixtures.getNextFixture);

    // Last Man Standing
    app.get('/api/prediction/lms/:gameId/cards',isLoggedIn, controllers.lms.getGameCards);
    app.get('/api/prediction/lms/:gameId/teams',isLoggedIn, controllers.lms.getTeamList);
    app.post('/api/prediction/lms',isLoggedIn, controllers.lms.addPredictionLMS);

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(401);
    res.send({error:'Not Logged In'});
}