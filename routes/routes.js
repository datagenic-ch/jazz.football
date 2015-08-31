module.exports = function(express, app, passport) {
    // =====================================
    // SECURE STATIC PAGES
    // =====================================
    app.all('/secure/*', function(req, res, next) {
        isLoggedIn(req, res, next);
    });
    app.use('/secure', express.static('./secure'));

    // =====================================
    // HOME PAGE
    // =====================================
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index');
    });

    // =====================================
    // FACEBOOK ROUTES
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/secure',
            failureRedirect : '/'
        }));

    // =====================================
    // LOGOUT
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}