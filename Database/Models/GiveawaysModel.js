const mongoose = require('mongoose')

const GiveawaysSchema = new mongoose.Schema({
    ChannelID: { type: String, required: true },
    MessageID: { type: String, required: true },
    Prize: { type: String, required: true },
    WinnerLength: { type: String, required: true },
    Active: { type: Boolean, default: true },
    CreatedOn: { type: Date, default: new Date() },
    EndsOn: { type: Date, required: true }
})

module.exports = mongoose.model('Giveaways', GiveawaysSchema)