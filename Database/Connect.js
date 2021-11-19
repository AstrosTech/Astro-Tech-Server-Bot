const mongoose = require('mongoose')
const chalk = require('chalk')

async function LoadDatabase() {
    console.log(chalk.magentaBright("Connecting to database..."))
    await mongoose.connect(process.env.MongoDBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log(chalk.magentaBright("Connected to database!"))
}

module.exports = LoadDatabase()