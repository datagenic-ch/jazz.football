// Load required packages
var mongoose = require('mongoose');

// Define our Last Man Standing game card schema
var GameCardLMSSchema = new mongoose.Schema({
    userId: String,
    gameId: String,
    week: Number,
    team: String
});

// Export the model
module.exports = mongoose.model('GameCardLMS', GameCardLMSSchema);