const mongoose = require('mongoose')

const TicketBanSchema = new mongoose.Schema({
    UserID: { type: String, required: true },
    BannedByID: { type: String, required: true },
    Active: { type: Boolean, default: true },
    CreatedOn: { type: Date, default: new Date() },
})

module.exports = mongoose.model('TicketBans', TicketBanSchema)