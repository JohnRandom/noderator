const fs = require('fs-extra')
const path = require('path')
const { generate } = require('../../utils')

const defaultPath = './src/modules'
const templateDir = path.join(__dirname, 'template')
const serviceTemplate = path.join(__dirname, 'template', 'service.js')
const placeholder = 'MODULE_NAME'

function getModuleName(name) {
  return name.split('/')[0]
}

function getServiceName(name) {
  return name.split('/')[1]
}

function checkName(name) {
  const parts = name.split('/').length
  return (parts === 2)
}

const generateModule = generate(defaultPath, templateDir, placeholder)

function generateService(keyword, type, name, program) {
  if (!checkName(name)) {
    const msg = 'Service name has to be <ModuleName>/<ServiceName>'
    throw new Error(msg)
  }

  const moduleName = getModuleName(name)
  const basePath = path.join('./src/modules', moduleName)
  name = getServiceName(name)

  if (!(fs.existsSync(basePath) || program.force)) {
    throw new Error(`Module "${moduleName}" doesn't exist!`)
  }

  generate(basePath, serviceTemplate).apply(null, arguments)
}

module.exports = { generateModule, generateService }
