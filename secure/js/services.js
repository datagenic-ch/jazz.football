function jazzFootballData($resource, $http) {
    var jfd = {};

    jfd.profile = $resource('/api/profile', null, {
        'update': {method:'PUT'}
    });

    jfd.game = $resource('/api/game/:gameId', null, {
        'save': {method:'POST'}
    });

    jfd.competition = $resource('/api/competition/:id', null, {
        'get': {method:'GET'}
    });

    jfd.prediction = {
        lms : $resource('/api/prediction/lms', null,{
            'save': {method:'POST'}
        })
    };

    jfd.getMyActiveGames = function() {
        return $http.get('/api/game/active');
    };
    jfd.getFixtures = function(competitionId) {
        return $http.get('/api/competition/'+competitionId+'/fixtures');
    };
    jfd.getNextFixture = function(competitionId) {
        return $http.get('/api/competition/'+competitionId+'/next');
    };
    jfd.getLMSTeams = function(gameId) {
        return $http.get('/api/prediction/lms/'+gameId+'/teams');
    };
    jfd.getLMSCards = function(gameId) {
        return $http.get('/api/prediction/lms/'+gameId+'/cards');
    };

    return jfd;
}