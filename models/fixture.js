// Load required packages
var mongoose = require('mongoose');

// Define our fixture schema
var FixtureSchema = new mongoose.Schema({
    competitionId: String,
    week: Number,
    closeDate: Date,
    fixtures: [{
        home: String,
        away: String,
        homeScore: Number,
        awayScore: Number
    }]
});

// Export the model
module.exports = mongoose.model('Fixture', FixtureSchema);