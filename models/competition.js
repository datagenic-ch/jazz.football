// Load required packages
var mongoose = require('mongoose');

// Define our competition schema
var CompetitionSchema = new mongoose.Schema({
    name: String,
    weeks: Number,
    nextWeek: Number,
    year: Number,
    teams: [String]
});

// Export the model
module.exports = mongoose.model('Competition', CompetitionSchema);