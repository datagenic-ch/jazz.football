module.exports = function(app, controllers) {
    // =====================================
    // GAME MANAGEMENT
    // =====================================
    app.get('/admin/game', isAdministrator, controllers.game.listAllGames);

};

function isAdministrator(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf('administrator') > -1)
            return next();
        else {
            res.status(401);
            res.render('error', {
                message: 'Unauthorized Access',
                error: {}
            });
        }
    } else
        res.redirect('/');

}