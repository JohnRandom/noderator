const path = require('path')
const { generate, findRoot } = require('../../utils')

const defaultPath = 'modules'
const templateDir = path.join(__dirname, 'template')
const placeholder = 'MODULE_NAME'

const generateModule = function(keyword, type, name, program) {
  const basePath = program.config.srcPath || path.resolve(findRoot(), 'src')
  const modulesPath = path.join(basePath, defaultPath)

  return generate(modulesPath, templateDir, placeholder).apply(null, arguments)
}

module.exports = generateModule
