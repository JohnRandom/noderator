const chalk = require('chalk')
const fs = require('fs-extra')
const fsPath = require('path')
const { substituteName, renameInitialFiles } = require('../../utils')
// const R = require('ramda')

function copyFiles(target, dest) {
  fs.copySync(`${target}/template`, dest)
}

function checkProjectRoot(projectRoot, force) {
  if (!fs.existsSync(projectRoot)) { return true }

  if (force) {
    console.log(chalk.yellow(`WARNING: Forced overwrite of "${projectRoot}"`))
  } else {
    throw new Error(`Project directory ${projectRoot} already exists`)
  }

  return true
}

function generateProject (name, { path, config, verbose, force }) {
  let message = `INFO: Generating project: ${name}`
  path = path || '.'
  const projectRoot = `${path}/${name}`
  const absPath = fsPath.resolve(projectRoot)

  if (!(path === '.')) { message += ` at ${absPath}` }

  console.log(chalk.cyan(message))

  if (checkProjectRoot(projectRoot, force)) {
    copyFiles(__dirname, projectRoot)
    renameInitialFiles(`${projectRoot}/**/*.initial`, verbose)
    substituteName(`${projectRoot}/**/*.*`, 'PROJECT_NAME', name, verbose)
  }

  console.log(`SUCCESS: New project "${name}" created at ${absPath}`)
}

module.exports = generateProject
