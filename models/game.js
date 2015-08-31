// Load required packages
var mongoose = require('mongoose');

// Define our game schema
var GameSchema = new mongoose.Schema({
    name: String,
    description: String,
    moderators: [String],
    players:[{
        userId: String,
        status: String,
        points: Number
    }],
    competitionId: String,
    type: String
});

// Export the model
module.exports = mongoose.model('Game', GameSchema);