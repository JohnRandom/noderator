#!/usr/bin/env node
const chalk = require('chalk')
const program = require('commander')
const R = require('ramda')

function getConfig() {
  let config
  const path = program.path || './config.js'

  try {
    config = require(path)
  } catch (err) {
    console.log(chalk.red(`ERROR: Cannot read config at "${path}"`))
    console.log(chalk.red(err))
    process.exit(1)
  }

  return config
}

function logVerbose() {
  const { verbose } = program
  const args = Array.prototype.slice.call(arguments)
  const prefixes = [ chalk.yellow('VERBOSE') ]

  if (verbose) {
    console.log.apply(console, prefixes.concat(args))
  }
}

program
  .arguments('<keyword>').arguments('<type>').arguments('<name>')

  .option('-c, --config [path]', 'The configuration file for noderator')
  .option('-p, --path [path]', 'Where to generate the new [type]')
  .option('-v, --verbose', 'Verbose mode', true)
  .option('-f, --force', 'Force the action, can overwrite existing files', true)

  .action((keyword, type, name) => {
    program.config = getConfig()

    logVerbose('Configuration:')
    logVerbose(program.config)

    const concept = program.config[keyword]
    if (R.isNil(concept)) {
      console.log(chalk.red(`ERROR: Unknown keyword "${keyword}"`))
      process.exit(1)
    }

    let funcs = concept[type]
    if (R.isNil(funcs)) {
      const types = Object.keys(concept)
      console.log(chalk.red(`ERROR: Unknown type "${keyword} ${type}"`))
      console.log(chalk.cyan(`INFO: Type(s) available "${types.join(', ')}"`))
      process.exit(1)
    }
    if (!(funcs instanceof Array)) {
      funcs = [ funcs ]
    }

    funcs.forEach(func => {
      if (!(func instanceof Function)) {
        let msg = `WARNING: each ${keyword}/${type} member needs to be a Function`
        msg += `, found "${typeof type}" instead!`
        console.log(chalk.yellow(msg))
        return
      }

      try {
        func(keyword, type, name, program)
      } catch (err) {
        console.log(chalk.red(err.message))
        console.log(chalk.red(err.stack))
        process.exit(1)
      }
    })

    process.exit(0)
  })

  .parse(process.argv)
