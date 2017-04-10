const fs = require('fs-extra')
const path = require('path')
const { generate } = require('../../utils')

const templateDir = path.join(__dirname, 'template')
const placeholder = 'COMPONENT_NAME'

function isSubcomponent(type) {
  return type.indexOf('/') >= 0
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

function renameComponent(basePath, name) {
  const componentDir = path.join(basePath, name)
  const componentFile = path.join(componentDir, 'component.jsx')
  fs.renameSync(componentFile, `${componentDir}/${name}.jsx`)
}

function renameTestFile(basePath, name) {
  const testDir = path.join(basePath, name, '__tests__')
  const testFile = path.join(testDir, 'component.tests.js')
  fs.renameSync(testFile, `${testDir}/${name}.tests.js`)
}

/*
 * Component names can come in two separate flavors:
 *
 *  1. ComponentName
 *  2. ModuleName/ComponentName
 *
 * Handling the second case requires to set a different `basePath` (module level
 * components folder instead of the global one) and a different `name` (stripping
 * the `ModuleName/` portion of the component name).
 *
 * @param [String] keyword The task to perform (`generate` in this case)
 * @param [String] type The type of module to create (`component` in this case)
 * @param [String] name The Name of the component to generate
 * @param [Object] program The `commander` object containg the command line args
 *
 * @see https://www.npmjs.com/package/commander
 */
function generateComponent(keyword, type, name, program) {
  let basePath = './src/components'

  if (!checkName(name)) {
    let msg = 'Component name has to be either <ComponentName>'
    msg += ' or <ModuleName>/<ComponentName>'
    throw new Error(msg)
  }

  if (isSubcomponent(name)) {
    basePath = path.join('./src/modules', getModuleName(name), 'components')
    name = getComponentName(name)
  }

  generate(basePath, templateDir, placeholder).apply(null, arguments)
  renameComponent(basePath, name)
  renameTestFile(basePath, name)
}

module.exports = generateComponent
