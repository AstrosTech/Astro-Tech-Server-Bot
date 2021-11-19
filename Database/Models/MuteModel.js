const mongoose = require('mongoose')

const MutesSchema = new mongoose.Schema({
    UserID: { type: String, required: true },
    Active: { type: Boolean, default: true },
    EndsOn: { type: Date, required: false },
    CreatedOn: { type: Date, default: new Date() },
})

module.exports = mongoose.model('Mutes', MutesSchema)