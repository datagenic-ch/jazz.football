/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl(jazzFootballData) {
    var self = this;

    self.helloText = 'Welcome to Jazz Football';
    self.descriptionText = 'The place for fantasy football, corporate football gaming management and more!';

    self.profile = jazzFootballData.profile.get();
    self.updateProfile = function() {
        jazzFootballData.profile.update(self.profile);
    }
}

function GameCtrl(jazzFootballData) {
    var self = this;
    self.games= [];
    self.game = {};
    self.gameTypes = ['Last Man Standing'];
    self.gameCompetitions = ['English Premier League'];

    self.addGame= function() {
        jazzFootballData.game.save(self.game);
    }
}

function GameListCtrl(jazzFootballData) {
    var self = this;
    self.games = jazzFootballData.game.query();
}

function predictionCtrl(jazzFootballData) {
    var self = this;
    self.competition = {};
    self.games = [];
    self.fixtures = [];
    self.fixture = {};
    self.game = {};
    self.teams = [];
    self.cards = [];
    self.team = '';
    self.prediction = {};
    self.message = '';
    self.addPredictionLMS = function() {
        self.prediction.gameId = self.game._id;
        self.prediction.week = self.fixture.week;
        self.prediction.team = self.team.name;
        jazzFootballData.prediction.lms.save(self.prediction,
            function(resp){
                if (resp.error) {
                    self.message = resp.error.message;
                } else {
                    self.message = '';
                }
                jazzFootballData.getLMSCards(self.game._id)
                    .success(function(data) {
                        self.cards = data;
                    })
            },function(err) {
                self.message = err.message;
        });

    };
    self.selectGame = function() {
        self.fixtures = [];
        self.competition = {};
        if (self.game.competitionId) {
            self.competition = jazzFootballData.competition.get({id: self.game.competitionId});
            if (self.game.type === 'Last Man Standing') {
                jazzFootballData.getNextFixture(self.game.competitionId)
                    .success(function(data) {
                        self.fixture = data;
                    });
                jazzFootballData.getLMSTeams(self.game._id)
                    .success(function(data) {
                        self.teams = data;
                    });
                jazzFootballData.getLMSCards(self.game._id)
                    .success(function(data) {
                        self.cards = data;
                    });
            } else {
                jazzFootballData.getFixtures(self.game.competitionId)
                    .success(function (data) {
                        self.fixtures = data;
                    })
            }
        }
    };

    jazzFootballData.getMyActiveGames()
        .success(function(data) {
            self.games = data;
        });
}


angular
    .module('inspinia')
    .service('jazzFootballData', ['$resource', '$http', jazzFootballData])
    .controller('MainCtrl', ['jazzFootballData',  MainCtrl])
    .controller('GameCtrl', ['jazzFootballData',  GameCtrl])
    .controller('GameListCtrl', ['jazzFootballData',  GameListCtrl])
    .controller('predictionCtrl', ['jazzFootballData',  predictionCtrl])
;