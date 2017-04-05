const glob = require('glob').sync
const replace = require('replace-in-file')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const options = {
  encoding: 'utf8',
  dot: true
}

function logSubstitution(from, to) {
  return (file) => {
    console.log(
      chalk.yellow('VERBOSE:'),
      `Replacing "${from}" -> "${to}" in ${file}`
    )
  }
}

function substituteName(pattern, from, to, verbose = false) {
  options.files = pattern instanceof Array ? pattern : [ pattern ]
  options.from = from
  options.to = to

  const files = replace.sync(options)

  if (verbose) files.forEach(logSubstitution(from, to))
}

function renameInitialFiles(pattern, verbose) {
  const files = glob(pattern, { dot: true })
  files.forEach((file) => {
    const dir = path.dirname(file)
    const filename = path.basename(file)
    const newFilename = filename.replace('.initial', '')

    fs.renameSync(file, `${dir}/${newFilename}`)

    if (verbose) {
      console.log(
        chalk.yellow('VERBOSE:'),
        `Renaming ${file} -> ${dir}/${newFilename}`
      )
    }
  })
}

module.exports = { substituteName, renameInitialFiles }
