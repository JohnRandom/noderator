#!/usr/bin/env node
const chalk = require('chalk')
const fsPath = require('path')
const program = require('commander')
const R = require('ramda')

const { findRoot } = require('./src/utils')

function getCustomConfig() {
  let config = null
  const configPath = program.config || fsPath.join(findRoot(), '.nrconfig')

  logVerbose('configPath', configPath)

  try {
    if (configPath) config = require(configPath)
  } catch (err) {
    logVerbose('Unable to locate custom config')
  }

  return config
}

function getConfig(type) {
  let config = require(`${__dirname}/config.js`)

  if (type === 'project') return config

  const customConfig = getCustomConfig()

  if (customConfig && customConfig instanceof Object) {
    config = Object.assign({}, config, customConfig)
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
    program.config = getConfig(type)

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
        if (program.verbose) console.log(chalk.red(err.stack))
        process.exit(1)
      }
    })

    process.exit(0)
  })

  .parse(process.argv)
