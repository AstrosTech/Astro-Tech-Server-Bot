const mongoose = require('mongoose')

const SuggestionsSchema = new mongoose.Schema({
    UserID: { type: String, required: true },
    MessageID: { type: String, required: true },
    Status: { type: Number, default: 1 },
    Active: { type: Boolean, default: true },
    Suggestion: { type: String, required: true },
    Category: { type: String, required: true },
    CreatedOn: { type: Date, default: new Date() },
})

module.exports = mongoose.model('Suggestions', SuggestionsSchema)