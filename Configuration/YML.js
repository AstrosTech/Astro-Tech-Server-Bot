const yaml = require('js-yaml')
const fs = require('fs')
const chalk = require('chalk')

module.exports.LoadConfiguration = () => {
        try{
        return yaml.safeLoad(fs.readFileSync('./Configuration/Config.yml', 'utf8'))
        } catch(err) {
            let JsonError = JSON.parse(JSON.stringify(err))

            console.log(chalk.bold(chalk.red(`Configuration Error! Turning off bot...`)) + chalk.bold(`\nLine: ${JsonError.mark.line}`))
        }
}