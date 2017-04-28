const glob = require('glob').sync
const replace = require('replace-in-file')
const chalk = require('chalk')
const fsPath = require('path')
const fs = require('fs-extra')
const R = require('ramda')

const substitutionOptions = {
  encoding: 'utf8'
}

const globOptions = {
  dot: true
}

function logSubstitution(from, to) {
  return (file) => {
    console.log(
      chalk.yellow('VERBOSE'),
      `Replacing "${from}" -> "${to}" in ${file}`
    )
  }
}

function substituteName(pattern, from, to, verbose = false) {
  substitutionOptions.files = pattern instanceof Array ? pattern : [ pattern ]
  substitutionOptions.from = new RegExp(from, 'g')
  substitutionOptions.to = to

  const files = replace.sync(substitutionOptions)

  if (verbose) files.forEach(logSubstitution(from, to))
}

function renameInitialFiles(pattern, verbose) {
  const files = glob(pattern, globOptions)
  files.forEach((file) => {
    const dir = fsPath.dirname(file)
    const filename = fsPath.basename(file)
    const newFilename = filename.replace('.initial', '')

    fs.renameSync(file, `${dir}/${newFilename}`)

    if (verbose) {
      console.log(
        chalk.yellow('VERBOSE'),
        `Renaming ${file} -> ${dir}/${newFilename}`
      )
    }
  })
}

function checkDirectoryRoot(dirRoot, force = false) {
  if (!fs.existsSync(dirRoot)) { return true }

  if (force) {
    console.log(chalk.yellow(`WARNING Forced overwrite of "${dirRoot}"`))
  } else {
    throw new Error(`Directory ${dirRoot} already exists`)
  }

  return true
}

function generate(defaultPath, templateDir, placeholder = null) {
  return function generateTree (keyword, type, name, program) {
    const { verbose, force } = program
    const path = program.path || defaultPath
    const location = fsPath.resolve(fsPath.join(path, name))
    placeholder = placeholder || `${type.toUpperCase()}_NAME`

    const message = `INFO Generating ${type}: ${name}`
    console.log(chalk.cyan(message))

    if (checkDirectoryRoot(location, force)) {
      fs.copySync(templateDir, location)
      renameInitialFiles(`${location}/**/*.initial`, verbose)
      if (!R.isNil(placeholder)) {
        substituteName(`${location}/**/*.*`, placeholder, name, verbose)
      }
    }

    console.log(`SUCCESS New ${type} "${name}" created at ${location}`)
  }
}

module.exports = {
  substituteName,
  renameInitialFiles,
  checkDirectoryRoot,
  generate
}
