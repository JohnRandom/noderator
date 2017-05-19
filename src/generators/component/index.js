const chalk = require('chalk')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const { generate, findRoot } = require('../../utils')

const templateDir = path.join(__dirname, 'template')
const placeholder = 'COMPONENT_NAME'

function isSubcomponent(type) {
  return type.indexOf('/') > 0
}

function getModuleName(name) {
  return name.split('/')[0]
}

function getComponentName(name) {
  return name.split('/')[1]
}

function checkName(name) {
  const parts = name.split('/').length
  return (parts === 1 || parts === 2)
}

function renameFiles(basePath, name, opts) {
  const paths = glob.sync(`${basePath}/**/component.*`)
  paths.forEach((path) => {
    const newPath = path.replace(/component\./g, `${name}.`)
    if (opts.verbose) {
      const msg = `Renaming template file "${path}" into "${newPath}"`
      console.log(chalk.yellow('VERBOSE'), msg)
    }
    fs.renameSync(path, newPath)
  })
}

/*
 * Component names can come in two separate flavors:
 *
 *  1. ComponentName
 *  2. ModuleName/ComponentName
 *
 * Handling the second case requires to set a different `basePath` (module level
 * components folder instead of the global one) and a different `name` (stripping
 * the `ModuleName/` portion of the component name). If a component is created as
 * part of a module, we assume that the module not being present constitutes an
 * input error and will not proceed creating the component, but show an error
 * instead.
 *
 * @param [String] keyword The task to perform (`generate` in this case)
 * @param [String] type The type of module to create (`component` in this case)
 * @param [String] name The Name of the component to generate
 * @param [Object] program The `commander` object containg the command line args
 *
 * @see https://www.npmjs.com/package/commander
 */
function generateComponent(keyword, type, name, program) {
  let basePath = program.config.srcPath || path.resolve(findRoot(), 'src')
  let componentsPath = path.join(basePath, 'components')
  let modulesPath = path.join(basePath, 'modules')
  const { verbose } = program

  if (!checkName(name)) {
    let msg = 'Component name has to be either <ComponentName>'
    msg += ' or <ModuleName>/<ComponentName>'
    throw new Error(msg)
  }

  if (isSubcomponent(name)) {
    const moduleName = getModuleName(name)
    const modulePath = basePath = path.join(modulesPath, moduleName)
    componentsPath = path.join(modulePath, 'components')
    name = getComponentName(name)

    if (!(fs.existsSync(modulePath) || program.force)) {
      throw new Error(`Module "${moduleName}" doesn't exist!`)
    }
  }

  generate(componentsPath, templateDir, placeholder).apply(null, arguments)
  renameFiles(componentsPath, name, { verbose })
}

module.exports = generateComponent
