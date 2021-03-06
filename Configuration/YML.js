const yaml = require('js-yaml')
const fs = require('fs')
const chalk = require('chalk')
let Configuration

module.exports.LoadConfiguration = () => {
        try{
        Configuration = yaml.safeLoad(fs.readFileSync('./Configuration/Config.yml', 'utf8'))
        return Configuration
        } catch(err) {
            let JsonError = JSON.parse(JSON.stringify(err))

            console.log(chalk.bold(chalk.red(`Configuration Error! Turning off bot...`)) + chalk.bold(`\nLine: ${JsonError.mark.line}`))
        }
}

module.exports.getConfiguration = () => { return Configuration }


module.exports.LoadCommandConfiguration = () => {
        try{
            return yaml.safeLoad(fs.readFileSync('./Configuration/Commands.yml', 'utf8'))
        } catch(err) {
            let JsonError = JSON.parse(JSON.stringify(err))

            console.log(chalk.bold(chalk.red(`Command Configuration Error! Turning off bot...`)) + chalk.bold(`\nLine: ${JsonError.mark.line}`))
        }
}