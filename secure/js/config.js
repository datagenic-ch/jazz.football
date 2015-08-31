/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html"
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Welcome' }
        })
        .state('index.add-game', {
            url: "/add-game",
            templateUrl: "views/games/add-game.html",
            data: { pageTitle: 'Add New Game' }
        })
        .state('index.games', {
            url: "/games",
            templateUrl: "views/games/list.html",
            data: { pageTitle: 'Games List' }
        })


        //============================================
        // Predictions
        //============================================
        .state('index.predict', {
            url: "/predict",
            templateUrl: "views/games/add-prediction.html",
            data: { pageTitle: 'Add Prediction' }
        })

        .state('index.profile', {
            url: "/edit-profile",
            templateUrl: "views/account/edit-profile.html",
            data: { pageTitle: 'Edit Profile' }
        })
}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
