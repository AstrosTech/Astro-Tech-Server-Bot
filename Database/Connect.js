const mongoose = require('mongoose')
const config = require('../Configuration/YML').LoadConfiguration();
const chalk = require('chalk')

async function LoadDatabase() {
    console.log(chalk.yellow("Connecting to database..."))
    await mongoose.connect(config.MongoDBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log(chalk.green("Connected to database!"))
}

module.exports = LoadDatabase()